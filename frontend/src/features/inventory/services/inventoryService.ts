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
}
