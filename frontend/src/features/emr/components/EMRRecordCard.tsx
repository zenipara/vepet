import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { MedicalRecordWithDetails } from '../services/emrService'
import { Calendar, Stethoscope } from 'lucide-react'

interface EMRRecordCardProps {
  record: MedicalRecordWithDetails
}

export const EMRRecordCard = ({ record }: EMRRecordCardProps) => {
  const visitDate = new Date(record.visit_date).toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Stethoscope className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold">{record.chief_complaint}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{visitDate}</span>
              {record.doctor_name && <span>· Dr. {record.doctor_name}</span>}
            </div>
          </div>
        </div>
      </div>

      {record.symptoms && record.symptoms.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">Gejala:</p>
          <div className="flex flex-wrap gap-2">
            {record.symptoms.map(symptom => (
              <Badge key={symptom} variant="warning">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {record.diagnosis && (
        <div className="mb-3 p-3 bg-blue-50 rounded">
          <p className="text-xs font-semibold text-blue-800 mb-1">Diagnosis:</p>
          <p className="text-sm text-blue-700">{record.diagnosis}</p>
        </div>
      )}

      {record.treatments && record.treatments.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">Tindakan:</p>
          <ul className="text-sm space-y-1">
            {record.treatments.map(t => (
              <li key={t.id} className="text-gray-700">
                • {t.name}
                {t.quantity && <span> × {t.quantity}</span>}
                {t.unit && <span> {t.unit}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.prescriptions && record.prescriptions.length > 0 && (
        <div className="p-3 bg-green-50 rounded">
          <p className="text-xs font-semibold text-green-800 mb-2">Resep Obat:</p>
          <ul className="text-sm space-y-1">
            {record.prescriptions.map(p => (
              <li key={p.id} className="text-green-700">
                • <strong>{p.medicine}</strong> {p.dosage}, {p.frequency}
                {p.duration && <span> selama {p.duration}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.follow_up_date && (
        <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-amber-700">
          Kontrol ulang: {new Date(record.follow_up_date).toLocaleDateString('id-ID')}
        </div>
      )}
    </Card>
  )
}
