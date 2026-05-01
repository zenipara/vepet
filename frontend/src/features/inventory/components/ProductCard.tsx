import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types/inventory'
import { AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isLowStock = product.stock_qty <= product.min_stock
  const stockPercentage = (product.stock_qty / (product.min_stock * 3)) * 100

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold">{product.name}</h4>
          <p className="text-xs text-gray-600 mt-1">SKU: {product.sku || '-'}</p>
        </div>
        {isLowStock && (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Rendah
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Stok</span>
            <span className={clsx('font-semibold', isLowStock ? 'text-red-600' : 'text-emerald-600')}>
              {product.stock_qty} {product.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={clsx(
                'h-2 rounded-full transition-all',
                isLowStock ? 'bg-red-500' : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Min: {product.min_stock}</p>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="text-xs text-gray-600">Harga Beli</p>
            <p className="font-semibold">Rp {product.price_buy?.toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Harga Jual</p>
            <p className="font-semibold text-emerald-600">Rp {product.price_sell?.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <Badge variant="info">{product.category}</Badge>
    </Card>
  )
}
