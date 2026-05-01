import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useInpatientRealtimeCase } from '@/features/inpatient/hooks/useInpatientRealtimeCase'
import { RecoveryTimeline } from '@/features/inpatient/components/RecoveryTimeline'
import { CasePhotoGallery } from '@/features/inpatient/components/CasePhotoGallery'

export const RecoveryPage = () => {
  const { caseId } = useParams()
  const { caseDetails: inpatientCase, updates, photos, loading, error, addUpdate, uploadPhoto } = useInpatientRealtimeCase(caseId || '')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-12">
        <p>Terjadi kesalahan: {error}</p>
      </div>
    )
  }

  if (!caseId || !inpatientCase) {
    return <div className="text-center text-gray-600 py-12">Data rawat inap tidak ditemukan</div>
  }

  const handleUploadPhoto = async (file: File, caption: string) => {
    setUploadingPhoto(true)
    try {
      await uploadPhoto(file, caption)
    } finally {
      setUploadingPhoto(false)
    }
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
      <h1 className="text-3xl font-bold mb-8">🏥 Journey Pemulihan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Case Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h3 className="font-bold mb-4 text-lg">📋 Informasi Rawat Inap</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Status</p>
                <Badge variant={inpatientCase.status === 'discharged' ? 'success' : 'warning'}>
                  {statusLabel}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Keparahan</p>
                <Badge variant={inpatientCase.severity === 'critical' ? 'danger' : 'default'}>
                  {severityLabel}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Tanggal Masuk</p>
                <p className="font-medium text-sm">{admitDate}</p>
              </div>
              {inpatientCase.cage_number && (
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Kandang</p>
                  <p className="font-medium text-sm">#{inpatientCase.cage_number}</p>
                </div>
              )}
              {inpatientCase.discharge_date && (
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Tanggal Pulang</p>
                  <p className="font-medium text-sm">
                    {new Date(inpatientCase.discharge_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}

              <hr className="my-4" />

              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-blue-600 font-semibold">💡 Tip</p>
                <p className="text-xs text-blue-800 mt-1">
                  Updates muncul secara real-time saat dokter hewan menambahkan informasi
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">📊 Statistik</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{updates.length}</p>
                <p className="text-xs text-gray-600">Update</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{photos.length}</p>
                <p className="text-xs text-gray-600">Foto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Recovery Timeline */}
          <div>
            <h2 className="text-2xl font-bold mb-6">📝 Perkembangan Pemulihan</h2>
            <RecoveryTimeline updates={updates} loading={loading} />
          </div>

          {/* Photo Gallery */}
          <div className="border-t pt-8">
            <CasePhotoGallery
              photos={photos}
              onAddPhoto={handleUploadPhoto}
              uploading={uploadingPhoto}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
