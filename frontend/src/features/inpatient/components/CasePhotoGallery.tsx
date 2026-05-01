import { useState } from 'react'
import type { CasePhoto } from '@/types/medical'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

interface CasePhotoGalleryProps {
  photos: CasePhoto[]
  onAddPhoto: (file: File, caption: string) => Promise<void>
  uploading?: boolean
}

export const CasePhotoGallery = ({ photos, onAddPhoto, uploading }: CasePhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<CasePhoto | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !caption.trim()) return

    try {
      await onAddPhoto(selectedFile, caption)
      setCaption('')
      setSelectedFile(null)
      setShowUploadForm(false)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">📸 Foto Pemulihan</h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {showUploadForm ? 'Batal' : 'Unggah Foto'}
        </button>
      </div>

      {showUploadForm && (
        <Card className="mb-6 p-4 bg-blue-50">
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Foto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keterangan
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Misalnya: Kondisi hari ke-3, sudah mulai makan..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 text-sm font-medium"
            >
              {uploading ? 'Mengunggah...' : 'Unggah Foto'}
            </button>
          </form>
        </Card>
      )}

      {photos.length === 0 ? (
        <Card className="text-center text-gray-600 py-8">
          Belum ada foto pemulihan
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Card className="overflow-hidden h-40 hover:shadow-lg transition">
                <img
                  src={photo.photo_url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </Card>
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {photo.caption}
              </p>
              {photo.created_at && (
                <p className="text-xs text-gray-400">
                  {new Date(photo.created_at).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl">
            <img
              src={selectedPhoto.photo_url}
              alt={selectedPhoto.caption}
              className="w-full h-auto rounded mb-4"
            />
            <h3 className="font-bold mb-2">Keterangan</h3>
            <p className="text-gray-700 mb-4">{selectedPhoto.caption}</p>
            {selectedPhoto.created_at && (
              <p className="text-xs text-gray-500">
                Diunggah pada {new Date(selectedPhoto.created_at).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
