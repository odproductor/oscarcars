export interface Preferences {
  itemsPerPage: number
  defaultView: 'tabla' | 'tarjetas'
}

export const DEFAULT_PREFS: Preferences = {
  itemsPerPage: 10,
  defaultView: 'tabla',
}

export const PREFS_KEY = 'oscarcars_prefs'
