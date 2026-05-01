export interface Product {
  id: string
  vendor_id?: string
  name: string
  sku?: string
  category: string
  description?: string
  unit: string
  price_buy?: number
  price_sell?: number
  stock_qty: number
  min_stock: number
  is_active: boolean
}

export interface Batch {
  id: string
  product_id: string
  batch_number: string
  quantity: number
  expiry_date: string
  received_date: string
}

export interface StockMovement {
  id: string
  product_id: string
  batch_id?: string
  type: 'in' | 'out' | 'adjustment' | 'expired'
  quantity: number
  reference_id?: string
  reference_type?: string
  notes?: string
  created_at: string
}
