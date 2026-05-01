import { ClinicLayout } from '@/app/layouts/ClinicLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Save } from 'lucide-react'
import { useState } from 'react'

interface MedicalRecord {
  id: string
  petName: string
  date: string
  chiefComplaint: string
  diagnosis: string
  treatment: string
  doctor: string
  prescription?: string
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    petName: 'Fluffy',
    date: '2024-01-20',
    chiefComplaint: 'Kuku kaki terlihat panjang dan kotor',
    diagnosis: 'Kuku yang terlalu panjang',
    treatment: 'Pemangkasan kuku dan pembersihan',
    doctor: 'Dr. Hendra',
    prescription: 'Obat topical untuk luka kecil',
  },
  {
    id: '2',
    petName: 'Fluffy',
    date: '2024-01-15',
    chiefComplaint: 'Gatal-gatal dan bulu rontok',
    diagnosis: 'Infeksi kulit ringan',
    treatment: 'Shampo medis dan antibiotik oral',
    doctor: 'Dr. Rina',
    prescription: 'Amoxilin 2x sehari selama 7 hari',
  },
]

export const EMRPage = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [newRecord, setNewRecord] = useState(false)

  return (
    <ClinicLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rekam Medis Elektronik (EMR)</h1>
            <p className="text-gray-600 mt-2">Kelola rekam medis pasien</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setNewRecord(true)}>
            <Plus className="w-4 h-4" />
            Rekam Medis Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-2">
            {records.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada rekam medis</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {records.map(record => (
                  <Card
                    key={record.id}
                    className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.petName}</h3>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <Badge>Keluhan: {record.chiefComplaint}</Badge>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                    </p>

                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Dokter:</span> {record.doctor}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          {selectedRecord && !newRecord && (
            <Card className="p-6 h-fit sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Detail Rekam Medis
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nama Hewan</p>
                  <p className="text-gray-900 font-medium">{selectedRecord.petName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tanggal</p>
                  <p className="text-gray-900 font-medium">{selectedRecord.date}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Keluhan Utama</p>
                  <p className="text-gray-900">{selectedRecord.chiefComplaint}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</p>
                  <p className="text-gray-900">{selectedRecord.diagnosis}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Penanganan</p>
                  <p className="text-gray-900">{selectedRecord.treatment}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Resep</p>
                  <p className="text-gray-900">
                    {selectedRecord.prescription || 'Tidak ada resep'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Dokter</p>
                  <p className="text-gray-900 font-medium">{selectedRecord.doctor}</p>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Edit Rekam Medis
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* New Record Form */}
          {newRecord && (
            <Card className="p-6 h-fit sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Rekam Medis Baru</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Hewan *
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama hewan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keluhan Utama *
                  </label>
                  <textarea
                    placeholder="Keluhan pasien"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis *
                  </label>
                  <textarea
                    placeholder="Diagnosis"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penanganan *
                  </label>
                  <textarea
                    placeholder="Penanganan yang diberikan"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Simpan Rekam Medis
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setNewRecord(false)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ClinicLayout>
  )
}

