import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useInpatientRealtimeCase } from '@/features/inpatient/hooks/useInpatientRealtimeCase'
import { RecoveryTimeline } from '@/features/inpatient/components/RecoveryTimeline'
import { CasePhotoGallery } from '@/features/inpatient/components/CasePhotoGallery'
import { Activity, BarChart3, CalendarDays, FileText, Info, ShieldCheck, Siren } from 'lucide-react'

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
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <Badge variant="info" className="w-fit">Rawat Inap</Badge>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Journey Pemulihan</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Pantau perkembangan pasien rawat inap dalam tampilan yang konsisten dan lebih mudah dibaca.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <Activity className="h-4 w-4 text-emerald-600" />
            Pembaruan real-time aktif
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Case Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
              <FileText className="h-5 w-5 text-cyan-600" />
              Informasi Rawat Inap
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <Badge variant={inpatientCase.status === 'discharged' ? 'success' : 'warning'}>
                  {statusLabel}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Keparahan</p>
                <Badge variant={inpatientCase.severity === 'critical' ? 'danger' : 'warning'}>
                  {severityLabel}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Tanggal Masuk</p>
                <p className="text-sm font-medium text-slate-900">{admitDate}</p>
              </div>
              {inpatientCase.cage_number && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Kandang</p>
                  <p className="text-sm font-medium text-slate-900">#{inpatientCase.cage_number}</p>
                </div>
              )}
              {inpatientCase.discharge_date && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Tanggal Pulang</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(inpatientCase.discharge_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}

              <hr className="my-4 border-slate-200" />

              <div className="rounded-2xl bg-cyan-50 p-3">
                <p className="flex items-center gap-1 text-xs font-semibold text-cyan-700">
                  <Info className="h-3.5 w-3.5" />
                  Tip
                </p>
                <p className="mt-1 text-xs text-cyan-800">
                  Updates muncul secara real-time saat dokter hewan menambahkan informasi
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Statistik
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{updates.length}</p>
                <p className="text-xs text-slate-500">Update</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{photos.length}</p>
                <p className="text-xs text-slate-500">Foto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Recovery Timeline */}
          <div>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              Perkembangan Pemulihan
            </h2>
            <RecoveryTimeline updates={updates} loading={loading} />
          </div>

          {/* Photo Gallery */}
          <div className="border-t border-slate-200 pt-8">
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
