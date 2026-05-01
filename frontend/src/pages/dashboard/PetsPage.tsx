import { useState } from 'react'
import { usePets } from '@/features/pets/hooks/usePets'
import { PetCard } from '@/features/pets/components/PetCard'
import { PetForm } from '@/features/pets/components/PetForm'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Plus, X } from 'lucide-react'
import type { Pet } from '@/types/global'

export const PetsPage = () => {
  const { pets, loading, refetch } = usePets()
  const [showForm, setShowForm] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
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
    setSelectedPet(null)
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hewan Peliharaan</h1>
          <p className="text-gray-600">Kelola dan pantau kesehatan hewan-hewan Anda</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Hewan
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Form Hewan Baru</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <PetForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 mb-4">Anda belum memiliki hewan peliharaan</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Hewan Pertama
            </Button>
          </div>
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
