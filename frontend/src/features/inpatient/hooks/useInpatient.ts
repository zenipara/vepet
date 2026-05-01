import { useEffect, useState } from 'react'
import { inpatientService } from '../services/inpatientService'
import type { InpatientCase } from '@/types/medical'

interface UseInpatientReturn {
  cases: InpatientCase[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useInpatient = (): UseInpatientReturn => {
  const [cases, setCases] = useState<InpatientCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await inpatientService.getActiveCases()
      setCases(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data rawat inap')
      console.error('Error fetching inpatient cases:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { cases, loading, error, refetch }
}
