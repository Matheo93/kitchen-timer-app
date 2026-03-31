'use client'

import { type Locale, setStoredLocale } from '@/lib/locale'

interface LocaleToggleProps {
  currentLocale: Locale
  onChange: (locale: Locale) => void
}

export function LocaleToggle({ currentLocale, onChange }: LocaleToggleProps) {
  function handleChange(locale: Locale) {
    setStoredLocale(locale)
    onChange(locale)
  }

  return (
    <div
      className="flex items-center gap-1 bg-amber-100 dark:bg-stone-800 rounded-full p-0.5"
      role="group"
      aria-label="Language selector"
    >
      <button
        onClick={() => handleChange('en')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
          currentLocale === 'en'
            ? 'bg-amber-500 text-white shadow-sm'
            : 'text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-stone-700'
        }`}
        aria-pressed={currentLocale === 'en'}
        lang="en"
      >
        EN
      </button>
      <button
        onClick={() => handleChange('fr')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
          currentLocale === 'fr'
            ? 'bg-amber-500 text-white shadow-sm'
            : 'text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-stone-700'
        }`}
        aria-pressed={currentLocale === 'fr'}
        lang="fr"
      >
        FR
      </button>
    </div>
  )
}
