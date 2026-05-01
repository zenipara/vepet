
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'staff' | 'doctor' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastActivity: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-10',
    lastActivity: '2024-01-25',
  },
  {
    id: '2',
    name: 'Dr. Hendra',
    email: 'hendra@example.com',
    role: 'doctor',
    status: 'active',
    joinDate: '2023-12-01',
    lastActivity: '2024-01-25',
  },
  {
    id: '3',
    name: 'Siti Nurhaliza',
    email: 'siti@example.com',
    role: 'staff',
    status: 'active',
    joinDate: '2023-11-15',
    lastActivity: '2024-01-24',
  },
  {
    id: '4',
    name: 'Ahmad Riyanto',
    email: 'ahmad@example.com',
    role: 'customer',
    status: 'inactive',
    joinDate: '2024-01-05',
    lastActivity: '2024-01-20',
  },
]

const roleConfig = {
  customer: { badge: 'info', label: 'Pelanggan' },
  staff: { badge: 'primary', label: 'Staf' },
  doctor: { badge: 'success', label: 'Dokter' },
  admin: { badge: 'danger', label: 'Admin' },
}

const statusConfig = {
  active: { badge: 'success', label: 'Aktif' },
  inactive: { badge: 'info', label: 'Nonaktif' },
  suspended: { badge: 'danger', label: 'Tersuspendsi' },
}

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    setSelectedUser(null)
  }

  return (
    
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
            <p className="text-gray-600 mt-2">{users.length} pengguna terdaftar</p>
          </div>
          <Button>Tambah Pengguna</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and User List */}
          <div className="lg:col-span-2">
            <Card className="p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            <div className="space-y-3">
              {filteredUsers.map(user => (
                <Card
                  key={user.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-emerald-500"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant={roleConfig[user.role].badge as any}>
                          {roleConfig[user.role].label}
                        </Badge>
                        <Badge variant={statusConfig[user.status].badge as any}>
                          {statusConfig[user.status].label}
                        </Badge>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          {selectedUser && (
            <Card className="p-6 h-fit sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Detail Pengguna</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nama</p>
                  <p className="text-gray-900 font-medium">{selectedUser.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Role</p>
                  <Badge variant={roleConfig[selectedUser.role].badge as any}>
                    {roleConfig[selectedUser.role].label}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <Badge variant={statusConfig[selectedUser.status].badge as any}>
                    {statusConfig[selectedUser.status].label}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tanggal Bergabung</p>
                  <p className="text-gray-900 font-medium">{selectedUser.joinDate}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Aktivitas Terakhir</p>
                  <p className="text-gray-900 font-medium">{selectedUser.lastActivity}</p>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Pengguna
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Pengguna
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    
  )
}
