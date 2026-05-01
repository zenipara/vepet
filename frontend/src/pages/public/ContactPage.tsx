import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'

export const ContactPage = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <Badge variant="success">Kontak</Badge>

      <div className="mt-6 space-y-6">
        <h1 className="text-2xl font-bold">Hubungi kami</h1>
        <p className="text-slate-700">Isi form berikut dan tim kami akan menghubungi Anda dalam 1-2 hari kerja.</p>

        <Card className="border-slate-200 bg-white">
          <div className="p-6 space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-slate-700">Nama</div>
              <Input placeholder="Nama lengkap" />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-slate-700">Email</div>
              <Input placeholder="email@contoh.com" type="email" />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-slate-700">Pesan</div>
              <Textarea placeholder="Tulis pesan Anda..." rows={5} />
            </label>

            <div>
              <Button>Kirim Pesan</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ContactPage
