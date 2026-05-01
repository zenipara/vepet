import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import type { InpatientCase, CaseUpdate } from '@/types/medical'

export const RecoveryPage = () => {
  const { caseId } = useParams()
  const [inpatientCase, setInpatientCase] = useState<InpatientCase | null>(null)
  const [updates, setUpdates] = useState<CaseUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!caseId) return

    const fetchData = async () => {
      try {
        const { supabase } = await import('@/lib/supabaseClient')
        
        // Fetch inpatient case
        const { data: caseData } = await supabase
          .from('inpatient_cases')
          .select('*')
          .eq('id', caseId)
          .single()

        setInpatientCase(caseData)

        // Fetch case updates (will implement realtime later)
        const { data: updatesData } = await supabase
          .from('case_updates')
          .select('*')
          .eq('case_id', caseId)
          .order('created_at', { ascending: false })

        setUpdates(updatesData || [])
      } catch (error) {
        console.error('Error fetching recovery data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [caseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!inpatientCase) {
    return <div className="text-center text-gray-600 py-12">Data rawat inap tidak ditemukan</div>
  }

  const statusLabel = {
    admitted: 'Masuk Rumah Sakit',
    lab_test: 'Tes Lab',
    observation: 'Pengamatan',
    recovery: 'Pemulihan',
    discharged: 'Pulang',
  }[inpatientCase.status]

  const severityLabel = {
    critical: 'Kritis',
    serious: 'Serius',
    normal: 'Normal',
    stable: 'Stabil',
  }[inpatientCase.severity]

  const admitDate = new Date(inpatientCase.admit_date).toLocaleDateString('id-ID')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Journey Pemulihan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <h3 className="font-bold mb-4">Informasi Rawat Inap</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600">Status</p>
              <Badge>{statusLabel}</Badge>
            </div>
            <div>
              <p className="text-xs text-gray-600">Tingkat Keparahan</p>
              <Badge>{severityLabel}</Badge>
            </div>
            <div>
              <p className="text-xs text-gray-600">Tanggal Masuk</p>
              <p className="font-medium">{admitDate}</p>
            </div>
            {inpatientCase.cage_number && (
              <div>
                <p className="text-xs text-gray-600">Nomor Kandang</p>
                <p className="font-medium">{inpatientCase.cage_number}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Perkembangan Pemulihan</h3>
          {updates.length === 0 ? (
            <Card className="text-center text-gray-600 py-8">
              Belum ada update pemulihan
            </Card>
          ) : (
            <div className="space-y-4">
              {updates.map(update => {
                const updateDate = new Date(update.created_at).toLocaleString('id-ID')
                return (
                  <Card key={update.id}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{update.title}</h4>
                      <Badge>{update.stage}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{updateDate}</p>
                    <p className="text-sm">{update.description}</p>
                    {update.vitals && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                        <p className="font-semibold mb-2">Vital Signs:</p>
                        {update.vitals.temperature && (
                          <p>• Suhu: {update.vitals.temperature}°C</p>
                        )}
                        {update.vitals.weight && <p>• Berat: {update.vitals.weight} kg</p>}
                        {update.vitals.heart_rate && (
                          <p>• Detak Jantung: {update.vitals.heart_rate} bpm</p>
                        )}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
