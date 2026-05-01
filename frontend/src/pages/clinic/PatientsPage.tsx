import { ClinicLayout } from '@/app/layouts/ClinicLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Calendar, Phone, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Patient {
  id: string
  petName: string
  breed: string
  species: string
  ownerName: string
  ownerPhone: string
  lastVisit: string
  nextAppointment?: string
  medicalRiskFlags: string[]
}

const mockPatients: Patient[] = [
  {
    id: '1',
    petName: 'Fluffy',
    breed: 'Persia',
    species: 'Kucing',
    ownerName: 'Budi Santoso',
    ownerPhone: '081234567890',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
    medicalRiskFlags: [],
  },
  {
    id: '2',
    petName: 'Max',
    breed: 'Golden Retriever',
    species: 'Anjing',
    ownerName: 'Siti Nurhaliza',
    ownerPhone: '081234567891',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-02-10',
    medicalRiskFlags: ['Alergi Makanan'],
  },
  {
    id: '3',
    petName: 'Bella',
    breed: 'Siamese',
    species: 'Kucing',
    ownerName: 'Ahmad Riyanto',
    ownerPhone: '081234567892',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-20',
    medicalRiskFlags: ['Penyakit Jantung'],
  },
]

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filteredPatients = patients.filter(
    patient =>
      patient.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ClinicLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Pasien Aktif</h1>
          <p className="text-gray-600 mt-2">
            {patients.length} pasien terdaftar di klinik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Patient List */}
          <div className="lg:col-span-2">
            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama hewan, pemilik, atau ras..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            <div className="space-y-4">
              {filteredPatients.map(patient => (
                <Card
                  key={patient.id}
                  className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.petName}</h3>
                      <p className="text-sm text-gray-600">
                        {patient.breed} - {patient.species}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{patient.ownerName}</p>
                    </div>
                    {patient.medicalRiskFlags.length > 0 && (
                      <Badge variant="warning">⚠ Risiko Medis</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Kunjungan: {patient.lastVisit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{patient.ownerPhone}</span>
                    </div>
                  </div>

                  {patient.medicalRiskFlags.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Bendera Risiko Medis
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalRiskFlags.map((flag, idx) => (
                          <Badge key={idx} variant="danger" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    Lihat Rekam Medis
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          {selectedPatient && (
            <Card className="p-6 h-fit sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Detail Pasien</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nama Hewan</p>
                  <p className="text-gray-900 font-medium">{selectedPatient.petName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Jenis</p>
                  <p className="text-gray-900 font-medium">
                    {selectedPatient.breed} ({selectedPatient.species})
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Pemilik</p>
                  <p className="text-gray-900 font-medium">{selectedPatient.ownerName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Kontak Pemilik</p>
                  <p className="text-gray-900 font-medium">{selectedPatient.ownerPhone}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Kunjungan Terakhir</p>
                  <p className="text-gray-900 font-medium">{selectedPatient.lastVisit}</p>
                </div>

                {selectedPatient.nextAppointment && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Janji Berikutnya
                    </p>
                    <p className="text-gray-900 font-medium">{selectedPatient.nextAppointment}</p>
                  </div>
                )}

                {selectedPatient.medicalRiskFlags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Bendera Risiko Medis
                    </p>
                    <div className="space-y-2">
                      {selectedPatient.medicalRiskFlags.map((flag, idx) => (
                        <Badge key={idx} variant="warning">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button className="w-full">Lihat Rekam Medis Lengkap</Button>
                  <Button variant="secondary" className="w-full">
                    Jadwalkan Janji Temu
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
