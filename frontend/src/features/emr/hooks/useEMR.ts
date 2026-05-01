import { useEffect, useState } from 'react'
import { emrService } from '../services/emrService'
import type { MedicalRecordWithDetails } from '../services/emrService'

interface UseEMRReturn {
  records: MedicalRecordWithDetails[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useEMR = (petId: string): UseEMRReturn => {
  const [records, setRecords] = useState<MedicalRecordWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await emrService.getPetMedicalHistory(petId)
      setRecords(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat rekam medis')
      console.error('Error fetching EMR:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (petId) refetch()
  }, [petId])

  return { records, loading, error, refetch }
}
