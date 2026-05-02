// Supabase removed. Lightweight shim that proxies basic table operations
// to a custom API gateway. This is an interim compatibility layer
// that exposes `supabase.from(table)...` chain used by the frontend services.

const API_URL = import.meta.env.VITE_API_URL || '/api'

class Query {
  table: string
  selectFields: string | null = null
  filters: Record<string, any> = {}
  orderBy: { column: string; ascending: boolean } | null = null
  method: string = 'GET'
  body: any = null
  singleFlag = false

  constructor(table: string) {
    this.table = table
  }

  select(fields = '*') {
    this.selectFields = fields
    return this
  }

  eq(column: string, value: any) {
    this.filters[column] = value
    return this
  }

  order(column: string, opts: { ascending?: boolean } = {}) {
    this.orderBy = { column, ascending: opts.ascending ?? true }
    return this
  }

  insert(payload: any) {
    this.method = 'POST'
    this.body = payload
    return this
  }

  update(payload: any) {
    this.method = 'PATCH'
    this.body = payload
    return this
  }

  delete() {
    this.method = 'DELETE'
    return this
  }

  single() {
    this.singleFlag = true
    return this
  }

  async execute() {
    try {
      // Build URL and options based on method and filters
      let url = `${API_URL.replace(/\/$/, '')}/${this.table}`
      const headers: Record<string, string> = { 'content-type': 'application/json' }

      // If GET and a single id filter exists, fetch by id
      if (this.method === 'GET') {
        const id = this.filters['id']
        if (id) url = `${url}/${encodeURIComponent(id)}`
        const params = new URLSearchParams()
        if (this.selectFields) params.set('_select', this.selectFields)
        if (this.orderBy) params.set('_order', `${this.orderBy.column}.${this.orderBy.ascending ? 'asc' : 'desc'}`)
        // include other simple filters as query params
        Object.keys(this.filters).forEach((k) => {
          if (k === 'id') return
          params.set(k, String(this.filters[k]))
        })
        const qs = params.toString()
        if (qs) url += `?${qs}`
      }

      const resp = await fetch(url, {
        method: this.method,
        headers,
        body: this.method === 'GET' ? undefined : JSON.stringify(this.body),
      })

      const contentType = resp.headers.get('content-type') || ''
      let data = null
      if (contentType.includes('application/json')) data = await resp.json()
      else data = await resp.text()

      if (!resp.ok) {
        return { data: null, error: { message: data?.message || resp.statusText, status: resp.status } }
      }

      // Unwrap backend response envelope { data: [...] }
      if (data && typeof data === 'object' && 'data' in data && !Array.isArray(data)) {
        data = data.data
      }

      // When single() used but response is array, pick first
      if (this.singleFlag && Array.isArray(data)) data = data[0] || null

      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Unknown error' } }
    }
  }

  // Make the Query awaitable: support `await supabase.from(...).select(... )`
  then(onFulfilled: any, onRejected?: any) {
    return this.execute().then(onFulfilled, onRejected)
  }
}

export const supabase = {
  from(table: string) {
    return new Query(table)
  },
  // Minimal rpc shim: return synchronous default for small helper functions
  rpc(name: string, _params?: any) {
    // Common helper used by frontend: min_stock
    if (name === 'min_stock') {
      // Default threshold used for low stock checks
      return 10
    }
    // Fallback: attempt to call backend RPC endpoint (async) - return Promise
    return fetch(`${API_URL.replace(/\/$/, '')}/rpc/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(_params || {}),
    })
      .then((r) => r.json())
      .catch(() => null)
  },
}

// Lightweight auth proxy to backend auth endpoints so frontend code using
// `supabase.auth.*` continues to work with the custom API gateway.
export const auth = {
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/auth/sign-in`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) return { data: null, error: data || { message: res.statusText } }
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async signUp({ email, password, options }: any) {
    try {
      const body: any = { email, password }
      // Merge userData fields directly into body (e.g., full_name)
      if (options?.data) Object.assign(body, options.data)
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/auth/sign-up`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) return { data: null, error: data || { message: res.statusText } }
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async signInWithOtp(_opts: any) {
    // Magic link / OTP not implemented on backend; return a not-implemented error
    return { data: null, error: { message: 'OTP sign-in not supported by API gateway' } }
  },

  async signOut() {
    // Frontend should remove tokens locally; backend has no sign-out endpoint
    return { data: null, error: null }
  },

  async getUser() {
    try {
      // Try to get token from sessionStorage/localStorage if available
      let token = null
      if (typeof window !== 'undefined') {
        token = window.localStorage?.getItem('vetcare_token') || 
                window.sessionStorage?.getItem('vetcare_token')
      }
      
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/auth/me`, { 
        method: 'GET',
        headers 
      })
      
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        return { 
          data: null, 
          error: data || { message: res.statusText } 
        }
      }
      
      // Backend returns { user: {...} }, so unwrap it
      return { data: data?.user || data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  },

  async getSession() {
    // Session handling is left to the app (tokens); return null for compatibility
    return { data: { session: null } }
  },
}

// Keep default export for compatibility
export default { supabase, auth }
