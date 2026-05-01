import { CaseUpdate } from '@/types/medical'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

interface RecoveryTimelineProps {
  updates: CaseUpdate[]
  loading?: boolean
}

export const RecoveryTimeline = ({ updates, loading }: RecoveryTimelineProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (updates.length === 0) {
    return (
      <Card className="text-center text-gray-600 py-12">
        Belum ada update pemulihan
      </Card>
    )
  }

  const stageColors: Record<string, string> = {
    'lab_test': 'bg-blue-100 text-blue-800',
    'observation': 'bg-yellow-100 text-yellow-800',
    'recovery': 'bg-green-100 text-green-800',
    'pre_discharge': 'bg-purple-100 text-purple-800',
    'discharge': 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-4">
      {updates.map((update, index) => {
        const updateDate = new Date(update.created_at).toLocaleString('id-ID')
        const isLatest = index === 0

        return (
          <div key={update.id} className="flex gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  isLatest ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-300'
                }`}
              />
              {index < updates.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-300 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1">
              <Card
                className={`${
                  isLatest ? 'border-l-4 border-l-green-500 bg-green-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{update.title}</h4>
                    {isLatest && (
                      <p className="text-xs text-green-600 font-semibold mt-1">
                        Update Terbaru
                      </p>
                    )}
                  </div>
                  <Badge className={stageColors[update.stage]}>
                    {update.stage}
                  </Badge>
                </div>

                <p className="text-xs text-gray-500 mb-3">{updateDate}</p>
                <p className="text-sm text-gray-700 mb-3">{update.description}</p>

                {update.vitals && (
                  <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                    <p className="font-semibold text-sm mb-2">📊 Vital Signs:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {update.vitals.temperature && (
                        <div>
                          <span className="text-gray-600">Suhu:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.temperature}°C
                          </span>
                        </div>
                      )}
                      {update.vitals.weight && (
                        <div>
                          <span className="text-gray-600">Berat:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.weight} kg
                          </span>
                        </div>
                      )}
                      {update.vitals.heart_rate && (
                        <div>
                          <span className="text-gray-600">Detak Jantung:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.heart_rate} bpm
                          </span>
                        </div>
                      )}
                      {update.vitals.respiratory_rate && (
                        <div>
                          <span className="text-gray-600">Nafas:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.respiratory_rate} rpm
                          </span>
                        </div>
                      )}
                      {update.vitals.blood_pressure && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Tekanan Darah:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.blood_pressure}
                          </span>
                        </div>
                      )}
                      {update.vitals.oxygen_saturation && (
                        <div>
                          <span className="text-gray-600">SpO2:</span>
                          <span className="font-medium ml-2">
                            {update.vitals.oxygen_saturation}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )
      })}
    </div>
  )
}
