import { useEffect, useState, useRef } from 'react'
import type { InpatientCase, CaseUpdate, CasePhoto } from '@/types/medical'
import { inpatientService } from '../services/inpatientService'

interface UseInpatientRealtimeCaseReturn {
  caseDetails: InpatientCase | null
  updates: CaseUpdate[]
  photos: CasePhoto[]
  loading: boolean
  error: string | null
  addUpdate: (payload: { stage: string; title: string; description: string; vitals?: Record<string, any> }) => Promise<void>
  uploadPhoto: (file: File, caption: string) => Promise<void>
}

export const useInpatientRealtimeCase = (caseId: string): UseInpatientRealtimeCaseReturn => {
  const [caseDetails, setCaseDetails] = useState<InpatientCase | null>(null)
  const [updates, setUpdates] = useState<CaseUpdate[]>([])
  const [photos, setPhotos] = useState<CasePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionsRef = useRef<any[]>([])

  useEffect(() => {
    if (!caseId) return

    const setupRealtime = async () => {
      setLoading(true)
      setError(null)

      try {
        const { api } = await import('@/lib/apiClient')

        // Initial fetch
        const caseData = await inpatientService.getCaseDetails(caseId)
        setCaseDetails(caseData)
        setUpdates(caseData?.case_updates || [])
        setPhotos(caseData?.case_photos || [])

        // Subscribe to case_updates table
        const updatesSubscription = supabase
          .channel(`case_updates:${caseId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'case_updates',
              filter: `case_id=eq.${caseId}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setUpdates((prev) => [payload.new as CaseUpdate, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setUpdates((prev) =>
                  prev.map((u) => (u.id === payload.new.id ? (payload.new as CaseUpdate) : u))
                )
              } else if (payload.eventType === 'DELETE') {
                setUpdates((prev) => prev.filter((u) => u.id !== payload.old.id))
              }
            }
          )
          .subscribe()

        // Subscribe to case_photos table
        const photosSubscription = supabase
          .channel(`case_photos:${caseId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'case_photos',
              filter: `case_id=eq.${caseId}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setPhotos((prev) => [payload.new as CasePhoto, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setPhotos((prev) =>
                  prev.map((p) => (p.id === payload.new.id ? (payload.new as CasePhoto) : p))
                )
              } else if (payload.eventType === 'DELETE') {
                setPhotos((prev) => prev.filter((p) => p.id !== payload.old.id))
              }
            }
          )
          .subscribe()

        // Subscribe to inpatient_cases updates for status changes
        const caseSubscription = supabase
          .channel(`inpatient_case:${caseId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'inpatient_cases',
              filter: `id=eq.${caseId}`,
            },
            (payload) => {
              setCaseDetails((prev) => (prev ? { ...prev, ...payload.new } : null))
            }
          )
          .subscribe()

        subscriptionsRef.current = [updatesSubscription, photosSubscription, caseSubscription]
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data rawat inap')
        console.error('Error setting up realtime:', err)
      } finally {
        setLoading(false)
      }
    }

    setupRealtime()

    return () => {
      // Cleanup subscriptions
      subscriptionsRef.current.forEach((sub) => {
        if (sub) {
          sub.unsubscribe()
        }
      })
      subscriptionsRef.current = []
    }
  }, [caseId])

  const addUpdate = async (payload: {
    stage: string
    title: string
    description: string
    vitals?: Record<string, any>
  }) => {
    try {
      await inpatientService.addUpdate(caseId, payload)
      // realtime will handle updating the state
    } catch (err: any) {
      setError(err.message || 'Gagal menambah update')
      throw err
    }
  }

  const uploadPhoto = async (file: File, caption: string) => {
    try {
      await inpatientService.uploadPhoto(caseId, file, caption)
      // realtime will handle updating the state
    } catch (err: any) {
      setError(err.message || 'Gagal upload foto')
      throw err
    }
  }

  return {
    caseDetails,
    updates,
    photos,
    loading,
    error,
    addUpdate,
    uploadPhoto,
  }
}
