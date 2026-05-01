import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export const Accordion = ({ items }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const open = openId === it.id

        return (
          <div key={it.id} className="rounded-2xl border border-slate-200 bg-white">
            <button
              onClick={() => setOpenId(open ? null : it.id)}
              aria-expanded={open}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-slate-800">{it.title}</span>
              <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="px-4 pb-4 pt-0 text-slate-700">
                <p>{it.content}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
