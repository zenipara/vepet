import { useState } from 'react'
import { usePets } from '@/features/pets/hooks/usePets'
import { PetCard } from '@/features/pets/components/PetCard'
import { PetForm } from '@/features/pets/components/PetForm'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Plus, X, PawPrint } from 'lucide-react'
import type { Pet } from '@/types/global'

export const PetsPage = () => {
  const { pets, loading, refetch } = usePets()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (petId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hewan ini?')) return

    setDeleting(true)
    try {
      const { petService } = await import('@/features/pets/services/petService')
      await petService.deletePet(petId)
      await refetch()
    } catch (error) {
      console.error('Error deleting pet:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleSuccess = async () => {
    setShowForm(false)
    await refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="info" className="w-fit">Data Hewan</Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Hewan Peliharaan</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Kelola dan pantau kesehatan hewan-hewan Anda dalam tampilan yang lebih seragam.</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Hewan
          </Button>
        )}
      </div>

      {showForm && (
        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Form Hewan Baru</h2>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <PetForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.length === 0 ? (
          <Card className="col-span-full border-slate-200 bg-white text-center shadow-sm">
            <div className="space-y-4 py-12">
              <PawPrint className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="text-slate-600">Anda belum memiliki hewan peliharaan</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Hewan Pertama
            </Button>
          </Card>
        ) : (
          pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={() => handleDelete(pet.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
