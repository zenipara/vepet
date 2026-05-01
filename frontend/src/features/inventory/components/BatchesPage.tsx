import { useEffect, useState } from 'react'
import { useInventory } from '@/features/inventory/hooks/useInventory'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { inventoryService } from '@/features/inventory/services/inventoryService'

export const BatchesPage = () => {
  const { products, loading, error } = useInventory()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [fetchingBatches, setFetchingBatches] = useState(false)

  const [form, setForm] = useState({ batch_number: '', quantity: 0, expiry_date: '', received_date: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!selectedProduct) return
      setFetchingBatches(true)
      try {
        const data = await inventoryService.getBatches(selectedProduct)
        setBatches(data || [])
      } catch (err) {
        console.error('Gagal memuat batch:', err)
      } finally {
        setFetchingBatches(false)
      }
    }
    load()
  }, [selectedProduct])

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg"/></div>
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setSubmitting(true)
    try {
      const created = await inventoryService.createBatch(selectedProduct, {
        batch_number: form.batch_number,
        quantity: Number(form.quantity),
        expiry_date: form.expiry_date,
        received_date: form.received_date || new Date().toISOString().split('T')[0],
      })

      // update product stock (add incoming qty)
      const product = products.find((p) => p.id === selectedProduct)
      const newStock = (product?.stock_qty || 0) + Number(form.quantity)
      await inventoryService.updateStock(selectedProduct, newStock)

      // record movement
      await inventoryService.recordStockMovement({
        product_id: selectedProduct,
        batch_id: created.id,
        type: 'in',
        quantity: Number(form.quantity),
        notes: `Penerimaan batch ${form.batch_number}`,
      })

      // refresh
      const refreshed = await inventoryService.getBatches(selectedProduct)
      setBatches(refreshed || [])
      setForm({ batch_number: '', quantity: 0, expiry_date: '', received_date: '' })
    } catch (err) {
      console.error('Gagal membuat batch:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manajemen Batch</h1>

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
            <Card className="text-center py-12 text-gray-600">Pilih produk untuk melihat batch</Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Batch untuk produk</h3>

                {fetchingBatches ? (
                  <div className="py-8 text-center"><Spinner /></div>
                ) : batches.length === 0 ? (
                  <div className="text-sm text-gray-600">Belum ada batch untuk produk ini.</div>
                ) : (
                  <div className="space-y-3">
                    {batches.map((b) => (
                      <div key={b.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="font-medium">{b.batch_number}</div>
                          <div className="text-xs text-gray-500">Kadaluarsa: {new Date(b.expiry_date).toLocaleDateString('id-ID')}</div>
                        </div>
                        <div className="text-sm text-gray-700">Qty: {b.quantity}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4">Buat Batch Baru</h3>
                <form onSubmit={handleCreateBatch} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    placeholder="Nomor Batch"
                    value={form.batch_number}
                    onChange={(e) => setForm((s) => ({ ...s, batch_number: e.target.value }))}
                    className="px-3 py-2 border rounded"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Kuantitas"
                    value={form.quantity}
                    onChange={(e) => setForm((s) => ({ ...s, quantity: Number(e.target.value) }))}
                    className="px-3 py-2 border rounded"
                    required
                  />

                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={(e) => setForm((s) => ({ ...s, expiry_date: e.target.value }))}
                    className="px-3 py-2 border rounded"
                    required
                  />

                  <input
                    type="date"
                    value={form.received_date}
                    onChange={(e) => setForm((s) => ({ ...s, received_date: e.target.value }))}
                    className="px-3 py-2 border rounded"
                  />

                  <div className="md:col-span-2 flex gap-3 mt-2">
                    <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Buat Batch'}</Button>
                    <Button type="button" variant="ghost" onClick={() => setForm({ batch_number: '', quantity: 0, expiry_date: '', received_date: '' })}>Batal</Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
