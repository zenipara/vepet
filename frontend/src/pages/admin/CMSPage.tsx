import { AdminLayout } from '@/app/layouts/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cmsService } from '@/features/cms/services/cmsService'

interface BlogPost {
  id: string
  title: string
  author: string
  date: string
  status: 'published' | 'draft' | 'archived'
  views: number
  category: string
}

interface Testimonial {
  id: string
  personName: string
  petName: string
  content: string
  rating: number
  status: 'published' | 'pending' | 'rejected'
  date: string
}

interface ClinicInfo {
  name: string
  address: string
  phone: string
  hours: string
  description: string
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Cara Merawat Kucing Kesayangan Anda',
    author: 'Dr. Hendra',
    date: '2024-01-20',
    status: 'published',
    views: 1024,
    category: 'Perawatan',
  },
  {
    id: '2',
    title: 'Vaksinasi Anjing: Panduan Lengkap',
    author: 'Dr. Rina',
    date: '2024-01-15',
    status: 'published',
    views: 856,
    category: 'Vaksinasi',
  },
  {
    id: '3',
    title: 'Gejala Penyakit Umum pada Hewan Peliharaan',
    author: 'Dr. Hendra',
    date: '2024-01-10',
    status: 'draft',
    views: 0,
    category: 'Kesehatan',
  },
]

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    personName: 'Budi Santoso',
    petName: 'Fluffy',
    content: 'Pelayanan yang luar biasa! Dokter sangat profesional dan peduli dengan hewan peliharaan saya.',
    rating: 5,
    status: 'published',
    date: '2024-01-20',
  },
  {
    id: '2',
    personName: 'Siti Nurhaliza',
    petName: 'Max',
    content: 'Klinik ini sangat bersih dan staf yang ramah. Sangat merekomendasikan!',
    rating: 5,
    status: 'published',
    date: '2024-01-18',
  },
  {
    id: '3',
    personName: 'Ahmad Riyanto',
    petName: 'Bella',
    content: 'Pengalaman yang menyenangkan membawa hewan peliharaan saya ke sini.',
    rating: 4,
    status: 'pending',
    date: '2024-01-25',
  },
]

const statusColors = {
  published: 'success',
  draft: 'info',
  archived: 'secondary',
  pending: 'warning',
  rejected: 'danger',
}

export const CMSPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials)
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null)
  const [editingClinic, setEditingClinic] = useState(false)
  const [savingClinic, setSavingClinic] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await cmsService.getClinicProfile()
        if (data) setClinicInfo({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          hours: data.hours || '',
          description: data.description || '',
        })
      } catch (err) {
        console.error('Gagal memuat profil klinik:', err)
      }
    }
    loadProfile()
  }, [])

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CMS & Konten</h1>
          <p className="text-gray-600 mt-2">Kelola konten website dan informasi klinik</p>
        </div>

        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
            <TabsTrigger value="clinic">Profil Klinik</TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari blog post..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Buat Blog Post
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredPosts.map(post => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    <Badge variant={statusColors[post.status] as any}>
                      {post.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex-1" />
                    <Button size="sm" variant="secondary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      {post.status === 'published' ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button size="sm" variant="danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Testimoni
            </Button>

            <div className="grid grid-cols-1 gap-4">
              {testimonials.map(testimonial => (
                <Card key={testimonial.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.personName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Hewan Peliharaan: <span className="font-medium">{testimonial.petName}</span>
                      </p>
                    </div>
                    <Badge variant={statusColors[testimonial.status] as any}>
                      {testimonial.status === 'published'
                        ? 'Dipublikasikan'
                        : testimonial.status === 'pending'
                          ? 'Pending'
                          : 'Ditolak'}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3 italic">"{testimonial.content}"</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {'⭐'.repeat(testimonial.rating)} ({testimonial.rating}/5)
                    </span>
                    {testimonial.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm">Setujui</Button>
                        <Button size="sm" variant="danger">
                          Tolak
                        </Button>
                      </div>
                    )}
                    {testimonial.status === 'published' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clinic Info Tab */}
          <TabsContent value="clinic" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Klinik</h3>

              {!clinicInfo ? (
                <div className="text-gray-600">Memuat...</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Klinik
                    </label>
                    <Input
                      value={clinicInfo.name}
                      onChange={e => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                      readOnly={!editingClinic}
                      className={editingClinic ? '' : 'bg-gray-50'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <Input
                      value={clinicInfo.address}
                      onChange={e => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                      readOnly={!editingClinic}
                      className={editingClinic ? '' : 'bg-gray-50'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <Input
                      value={clinicInfo.phone}
                      onChange={e => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                      readOnly={!editingClinic}
                      className={editingClinic ? '' : 'bg-gray-50'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jam Operasional
                    </label>
                    <Input
                      value={clinicInfo.hours}
                      onChange={e => setClinicInfo({ ...clinicInfo, hours: e.target.value })}
                      readOnly={!editingClinic}
                      className={editingClinic ? '' : 'bg-gray-50'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={clinicInfo.description}
                      onChange={e => setClinicInfo({ ...clinicInfo, description: e.target.value })}
                      readOnly={!editingClinic}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${editingClinic ? '' : 'bg-gray-50 text-gray-700'}`}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    {!editingClinic ? (
                      <Button onClick={() => setEditingClinic(true)}>Edit Informasi Klinik</Button>
                    ) : (
                      <>
                        <Button
                          onClick={async () => {
                            setSavingClinic(true)
                            try {
                              await cmsService.updateClinicProfile(clinicInfo as any)
                              setEditingClinic(false)
                            } catch (err) {
                              console.error('Gagal menyimpan profil klinik:', err)
                            } finally {
                              setSavingClinic(false)
                            }
                          }}
                          disabled={savingClinic}
                        >
                          Simpan
                        </Button>
                        <Button variant="secondary" onClick={() => setEditingClinic(false)}>Batal</Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
