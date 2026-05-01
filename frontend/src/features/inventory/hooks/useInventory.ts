import { useEffect, useState } from 'react'
import { inventoryService } from '../services/inventoryService'
import type { Product, Batch } from '@/types/inventory'

interface UseInventoryReturn {
  products: Product[]
  expiringBatches: Batch[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useInventory = (): UseInventoryReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [expiringBatches, setExpiringBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)

    try {
      const [productsData, expiringData] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getExpiringBatches(30),
      ])

      setProducts(productsData)
      setExpiringBatches(expiringData)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data inventory')
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { products, expiringBatches, loading, error, refetch }
}
