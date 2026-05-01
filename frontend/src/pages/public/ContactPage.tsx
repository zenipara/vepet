import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useState } from 'react'
import SEO from '@/components/seo/SEO'

export const ContactPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Placeholder: in future replace with API call (Supabase function / serverless)
      await new Promise((r) => setTimeout(r, 700))
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="public-page-shell">
      <div className="public-page-container max-w-3xl">
        <SEO title="Kontak — VetCare" description="Hubungi tim VetCare untuk demo, support, atau pertanyaan produk." />
        <Badge variant="success">Kontak</Badge>

        <div className="mt-6 space-y-6">
          <h1 className="public-page-headline">Hubungi kami</h1>
          <p className="public-page-subtitle">Isi form berikut dan tim kami akan menghubungi Anda dalam 1-2 hari kerja.</p>

          <Card className="public-surface-card">
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Nama</div>
                <Input placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-700">Email</div>
                <Input placeholder="email@contoh.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-700">Pesan</div>
                <Textarea placeholder="Tulis pesan Anda..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
              </label>

              <div>
                <Button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </div>

              {status === 'sent' && <p className="text-sm text-emerald-600">Pesan terkirim, terima kasih!</p>}
              {status === 'error' && <p className="text-sm text-red-600">Terjadi kesalahan, coba lagi nanti.</p>}
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
