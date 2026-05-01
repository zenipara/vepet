import { useEffect, useState } from 'react'
import { useInventory } from '@/features/inventory/hooks/useInventory'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { inventoryService } from '@/features/inventory/services/inventoryService'

export const StockMovementsPage = () => {
  const { products, loading, error } = useInventory()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [movements, setMovements] = useState<any[]>([])
  const [loadingMovements, setLoadingMovements] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!selectedProduct) return
      setLoadingMovements(true)
      try {
        const data = await inventoryService.getStockMovements(selectedProduct)
        setMovements(data || [])
      } catch (err) {
        console.error('Gagal memuat pergerakan stok:', err)
      } finally {
        setLoadingMovements(false)
      }
    }
    load()
  }, [selectedProduct])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg"/></div>
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Riwayat Pergerakan Stok</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Produk</h3>
            <div className="space-y-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p.id)}
                  className={`w-full text-left px-3 py-2 rounded ${selectedProduct === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-gray-500">{p.stock_qty}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!selectedProduct ? (
            <Card className="text-center py-12 text-gray-600">Pilih produk untuk melihat riwayat pergerakan</Card>
          ) : (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Pergerakan Stok</h3>
              {loadingMovements ? (
                <div className="py-8 text-center"><Spinner /></div>
              ) : movements.length === 0 ? (
                <div className="text-sm text-gray-600">Belum ada pergerakan untuk produk ini.</div>
              ) : (
                <div className="space-y-3">
                  {movements.map((m) => (
                    <div key={m.id} className="p-3 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{m.type.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{m.notes || m.reference_type || '-'}</div>
                      </div>
                      <div className="text-sm text-gray-700">{m.quantity}</div>
                      <div className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
