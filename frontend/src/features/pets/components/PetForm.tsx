import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { petService } from '../services/petService'
import type { Pet } from '@/types/global'

const petSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  species: z.string().min(1, 'Pilih jenis hewan'),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  birth_date: z.string().optional(),
  weight_kg: z.coerce.number().optional(),
  color: z.string().optional(),
})

type PetFormData = z.infer<typeof petSchema>

interface PetFormProps {
  pet?: Pet
  onSuccess?: (pet: Pet) => void
  onCancel?: () => void
}

export const PetForm = ({ pet, onSuccess, onCancel }: PetFormProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender as any,
          birth_date: pet.birth_date,
          weight_kg: pet.weight_kg,
          color: pet.color,
        }
      : undefined,
  })

  const onSubmit = async (data: PetFormData) => {
    setLoading(true)
    setError('')

    try {
      let result: Pet
      if (pet) {
        result = await petService.updatePet(pet.id, data)
      } else {
        result = await petService.createPet(data)
      }
      onSuccess?.(result)
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data hewan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">{pet ? 'Edit Hewan' : 'Tambah Hewan Peliharaan'}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nama Hewan"
          placeholder="Misal: Fluffy, Buddy"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Hewan *</label>
            <select
              {...register('species')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Pilih jenis</option>
              <option value="dog">Anjing</option>
              <option value="cat">Kucing</option>
              <option value="rabbit">Kelinci</option>
              <option value="bird">Burung</option>
              <option value="hamster">Hamster</option>
              <option value="other">Lainnya</option>
            </select>
            {errors.species && <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>}
          </div>

          <Input label="Ras / Breed" placeholder="Misal: Golden Retriever" {...register('breed')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select
              {...register('gender')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Pilih</option>
              <option value="male">Jantan</option>
              <option value="female">Betina</option>
            </select>
          </div>

          <Input label="Tanggal Lahir" type="date" {...register('birth_date')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Berat (kg)" type="number" step="0.1" placeholder="5.0" {...register('weight_kg')} />
          <Input label="Warna / Ciri" placeholder="Putih, coklat, dll" {...register('color')} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" loading={loading}>
            {pet ? 'Simpan Perubahan' : 'Tambah Hewan'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Batal
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
