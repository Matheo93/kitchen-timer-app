import { getRequestConfig } from 'next-intl/server'

// Static export compatible: no server cookies, locale detection is client-side only
// next-intl is used for type-safe message keys; runtime locale switching uses src/lib/locale.ts
export default getRequestConfig(async () => {
  const locale = 'en'
  const messages = (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>

  return {
    locale,
    messages,
  }
})
