import type { Service } from '@/types/global'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, DollarSign } from 'lucide-react'
import clsx from 'clsx'

interface ServiceCardProps {
  service: Service
  isSelected?: boolean
  onClick?: () => void
}

export const ServiceCard = ({ service, isSelected, onClick }: ServiceCardProps) => {
  const categoryLabel = {
    medical: 'Medis',
    grooming: 'Grooming',
    consultation: 'Konsultasi',
    other: 'Lainnya',
  }[service.category] || service.category

  return (
    <Card
      onClick={onClick}
      className={clsx(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-emerald-500 bg-emerald-50'
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{service.name}</h4>
          <Badge variant="info" className="mt-1">{categoryLabel}</Badge>
        </div>
      </div>

      {service.description && (
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
      )}

      <div className="flex gap-4 text-sm text-gray-600 pt-3 border-t">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{service.duration_min} menit</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-emerald-600">
          <DollarSign className="w-4 h-4" />
          <span>Rp {service.price.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </Card>
  )
}
