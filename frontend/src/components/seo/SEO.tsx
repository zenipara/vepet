import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  image?: string
  url?: string
}

export const SEO = ({ title, description, image, url }: SEOProps) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const setMeta = (selector: string, attr: string, value?: string) => {
      if (!value) return
      let el = document.head.querySelector(selector) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        if (selector.startsWith('meta[name=')) el.setAttribute('name', selector.match(/meta\[name="?([^"\]]+)"?\]/)![1])
        else if (selector.startsWith('meta[property=')) el.setAttribute('property', selector.match(/meta\[property="?([^"\]]+)"?\]/)![1])
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:card"]', 'content', image ? 'summary_large_image' : 'summary')
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', image)

    return () => {
      document.title = prevTitle
    }
  }, [title, description, image, url])

  return null
}

export default SEO
