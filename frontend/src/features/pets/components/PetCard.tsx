import type { Pet } from '@/types/global'
import { PawPrint, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PetCardProps {
  pet: Pet
  isSelected?: boolean
  onClick?: () => void
  onDelete?: () => void
}

export const PetCard = ({ pet, isSelected, onClick, onDelete }: PetCardProps) => {
  const age = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-slate-200 bg-white hover:border-emerald-300'
      }`}
    >
      <div className="flex gap-4">
        {pet.photo_url ? (
          <img src={pet.photo_url} alt={pet.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-slate-400" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <p className="text-sm text-slate-600">
            {pet.species}
            {pet.breed && ` • ${pet.breed}`}
          </p>
          <div className="flex gap-4 text-xs text-slate-500 mt-2">
            {pet.gender && <span>{pet.gender === 'male' ? 'Jantan' : 'Betina'}</span>}
            {age && <span>{age} tahun</span>}
            {pet.weight_kg && <span>{pet.weight_kg} kg</span>}
          </div>
        </div>

        {onDelete && (
          <button
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
