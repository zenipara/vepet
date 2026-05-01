import { useEffect, useState } from 'react'
import { petService } from '../services/petService'
import type { Pet } from '@/types/global'

interface UsePetsReturn {
  pets: Pet[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const usePets = (): UsePetsReturn => {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await petService.getMyPets()
      setPets(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data hewan')
      console.error('Error fetching pets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { pets, loading, error, refetch }
}
