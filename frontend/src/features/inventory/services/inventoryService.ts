import type { Product } from '@/types/inventory'

export const inventoryService = {
  async getProducts(): Promise<Product[]> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data || []
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('name')

    if (error) throw error
    return data || []
  },

  async getLowStockProducts(): Promise<Product[]> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .lte('stock_qty', supabase.rpc('min_stock'))

    if (error) throw error
    return data || []
  },

  async updateStock(productId: string, newQuantity: number): Promise<void> {
    const { supabase } = await import('@/lib/supabaseClient')
    const { error } = await supabase
      .from('products')
      .update({ stock_qty: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (error) throw error
  },

  async getBatches(productId: string) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('product_id', productId)
      .order('expiry_date')

    if (error) throw error
    return data || []
  },

  async getExpiringBatches(days = 30) {
    const { supabase } = await import('@/lib/supabaseClient')
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
      .from('batches')
      .select('*, products(name)')
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .gt('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date')

    if (error) throw error
    return data || []
  },

  async getStockMovements(productId: string) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createBatch(productId: string, payload: { batch_number: string; quantity: number; expiry_date: string; received_date?: string }) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('batches')
      .insert({ product_id: productId, ...payload })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async recordStockMovement(payload: {
    product_id: string
    batch_id?: string
    type: 'in' | 'out' | 'adjustment' | 'expired'
    quantity: number
    reference_id?: string
    reference_type?: string
    notes?: string
  }) {
    const { supabase } = await import('@/lib/supabaseClient')
    const { data, error } = await supabase
      .from('stock_movements')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Consume quantity from a batch and update product stock atomically (best-effort)
  async consumeFromBatch(productId: string, batchId: string | undefined, quantity: number, reference?: { id?: string; type?: string }) {
    const { supabase } = await import('@/lib/supabaseClient')

    // Decrease batch quantity if batch provided
    if (batchId) {
      // Get current batch quantity first
      const { data: batch } = await (supabase as any)
        .from('batches')
        .select('quantity')
        .eq('id', batchId)
        .single()

      const newQuantity = batch ? Math.max((batch.quantity || 0) - quantity, 0) : 0

      const { error: batchError } = await supabase
        .from('batches')
        .update({ quantity: newQuantity })
        .eq('id', batchId)

      if (batchError) throw batchError
    }

    // Decrease product stock
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Produk tidak ditemukan')

    const newQty = Math.max((product.stock_qty || 0) - quantity, 0)
    const { error: prodError } = await supabase
      .from('products')
      .update({ stock_qty: newQty, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (prodError) throw prodError

    // Record movement
    await inventoryService.recordStockMovement({
      product_id: productId,
      batch_id: batchId,
      type: 'out',
      quantity,
      reference_id: reference?.id,
      reference_type: reference?.type,
      notes: reference ? `Auto-deduct for ${reference.type || 'unknown'}` : 'Auto-deduct',
    })
  },
}
