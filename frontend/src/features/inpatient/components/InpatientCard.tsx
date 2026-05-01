import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { InpatientCase } from '@/types/medical'
import { AlertCircle, Calendar } from 'lucide-react'

interface InpatientCardProps {
  inpatientCase: InpatientCase
  onClick?: () => void
}

export const InpatientCard = ({ inpatientCase, onClick }: InpatientCardProps) => {
  const statusLabel = {
    admitted: 'Masuk Rumah Sakit',
    lab_test: 'Tes Lab',
    observation: 'Pengamatan',
    recovery: 'Pemulihan',
    discharged: 'Pulang',
  }[inpatientCase.status]

  const severityVariant = {
    critical: 'danger',
    serious: 'warning',
    normal: 'info',
    stable: 'success',
  }[inpatientCase.severity] as any

  const admitDate = new Date(inpatientCase.admit_date).toLocaleDateString('id-ID')

  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg">{inpatientCase.pets?.name}</h4>
          <p className="text-sm text-gray-600">{inpatientCase.pets?.species}</p>
        </div>
        <Badge variant={severityVariant}>{inpatientCase.severity}</Badge>
      </div>

      <div className="space-y-2 text-sm mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span>{admitDate}</span>
        </div>
        <Badge>{statusLabel}</Badge>
      </div>

      {inpatientCase.cage_number && (
        <p className="text-xs text-gray-600">Kandang: {inpatientCase.cage_number}</p>
      )}

      {inpatientCase.notes && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{inpatientCase.notes}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
