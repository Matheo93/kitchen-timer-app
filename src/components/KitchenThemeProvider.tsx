'use client'

import { ThemeProvider } from 'next-themes'

/**
 * KitchenThemeProvider — wraps the app with next-themes.
 * Enables system-aware dark mode with a manual override toggle.
 * Attribute "class" means .dark is added to <html>.
 */
export function KitchenThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
