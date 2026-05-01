import { useEffect, useState } from 'react'
import { cmsService } from '../services/cmsService'

interface UseFeatureFlagsReturn {
  flags: Record<string, boolean>
  loading: boolean
  error: string | null
}

export const useFeatureFlags = (): UseFeatureFlagsReturn => {
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const data = await cmsService.getFeatureFlags()
        const flagMap = data.reduce(
          (acc, flag) => {
            acc[flag.key] = flag.is_enabled
            return acc
          },
          {} as Record<string, boolean>
        )
        setFlags(flagMap)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFlags()
  }, [])

  return { flags, loading, error }
}

export const useFeatureFlag = (key: string): boolean => {
  const { flags } = useFeatureFlags()
  return flags[key] ?? false
}
