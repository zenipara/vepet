/**
 * Analytics service for tracking user interactions on public pages
 * Stores events in localStorage for later analysis
 */

export type AnalyticsEvent = {
  id: string
  type: 'cta_click' | 'page_view' | 'form_submit' | 'theme_toggle'
  label: string
  timestamp: number
  url: string
}

const STORAGE_KEY = 'vetcare_analytics_events'
const MAX_EVENTS = 100

class AnalyticsService {
  /**
   * Track a user interaction event
   */
  trackEvent(type: AnalyticsEvent['type'], label: string) {
    const event: AnalyticsEvent = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      label,
      timestamp: Date.now(),
      url: window.location.pathname,
    }

    this.saveEvent(event)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', event)
    }
  }

  /**
   * Track CTA click with conversion goal
   */
  trackCTAClick(label: string, conversionGoal?: string) {
    this.trackEvent('cta_click', `${label}${conversionGoal ? ` - ${conversionGoal}` : ''}`)
  }

  /**
   * Track theme toggle
   */
  trackThemeToggle(newTheme: 'soft' | 'vivid') {
    this.trackEvent('theme_toggle', `Changed to ${newTheme} theme`)
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string) {
    this.trackEvent('form_submit', `${formName} submitted`)
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to retrieve analytics events:', error)
      return []
    }
  }

  /**
   * Get events by type
   */
  getEventsByType(type: AnalyticsEvent['type']): AnalyticsEvent[] {
    return this.getEvents().filter((event) => event.type === type)
  }

  /**
   * Get conversion summary
   */
  getConversionSummary() {
    const events = this.getEvents()
    return {
      totalEvents: events.length,
      ctaClicks: events.filter((e) => e.type === 'cta_click').length,
      formSubmissions: events.filter((e) => e.type === 'form_submit').length,
      themeToggles: events.filter((e) => e.type === 'theme_toggle').length,
      conversionRate: events.filter((e) => e.type === 'cta_click').length / Math.max(1, events.length),
    }
  }

  /**
   * Clear all events
   */
  clearEvents() {
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Save event to localStorage
   */
  private saveEvent(event: AnalyticsEvent) {
    try {
      const events = this.getEvents()
      events.push(event)

      // Keep only last MAX_EVENTS
      if (events.length > MAX_EVENTS) {
        events.shift()
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('Failed to save analytics event:', error)
    }
  }
}

export const analyticsService = new AnalyticsService()
