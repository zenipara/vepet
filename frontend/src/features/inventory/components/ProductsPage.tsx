import { useInventory } from '@/features/inventory/hooks/useInventory'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'

export const ProductsPage = () => {
  const { products, expiringBatches, loading, error } = useInventory()

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg"/></div>
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory Produk</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-gray-500">SKU: {p.sku}</p>
              </div>
              <Badge>{p.unit}</Badge>
            </div>
            <p className="text-sm text-gray-700">Stok: {p.current_stock}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Batch Mendekati Kadaluarsa</h2>
        {expiringBatches.length === 0 ? (
          <Card className="text-center text-gray-600 py-8">Tidak ada batch yang mendekati kadaluarsa</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiringBatches.map((b) => (
              <Card key={b.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{b.batch_number}</p>
                    <p className="text-xs text-gray-500">Produk ID: {b.product_id}</p>
                  </div>
                  <p className="text-sm text-red-600">Kadaluarsa: {new Date(b.expiry_date).toLocaleDateString('id-ID')}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
