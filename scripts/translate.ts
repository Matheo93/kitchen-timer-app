/**
 * scripts/translate.ts
 * Generates/validates translated JSON files from the base en.json.
 * Usage: bunx tsx scripts/translate.ts
 *
 * This script:
 * 1. Reads messages/en.json as the source of truth
 * 2. For each supported locale, checks if messages/{locale}.json exists
 * 3. Reports missing/extra keys vs the English base
 * 4. Does NOT overwrite existing translations — it only reports gaps
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(process.cwd())
const MESSAGES_DIR = join(ROOT, 'messages')
const LOCALES = ['en', 'fr'] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NestedRecord = Record<string, any>

function flattenKeys(obj: NestedRecord, prefix = ''): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string') {
      keys.push(fullKey)
    } else {
      keys.push(...flattenKeys(v as NestedRecord, fullKey))
    }
  }
  return keys
}

const enPath = join(MESSAGES_DIR, 'en.json')
const enMessages = JSON.parse(readFileSync(enPath, 'utf-8')) as NestedRecord
const enKeys = new Set(flattenKeys(enMessages))

console.log(`Base (en): ${enKeys.size} keys`)

for (const locale of LOCALES) {
  if (locale === 'en') continue
  const localePath = join(MESSAGES_DIR, `${locale}.json`)

  if (!existsSync(localePath)) {
    console.log(`\n[${locale}] Missing — creating empty scaffold...`)
    writeFileSync(localePath, JSON.stringify(enMessages, null, 2))
    console.log(`[${locale}] Created scaffold from en.json — translate the values!`)
    continue
  }

  const localeMessages = JSON.parse(readFileSync(localePath, 'utf-8')) as NestedRecord
  const localeKeys = new Set(flattenKeys(localeMessages))

  const missing = [...enKeys].filter((k) => !localeKeys.has(k))
  const extra = [...localeKeys].filter((k) => !enKeys.has(k))

  if (missing.length === 0 && extra.length === 0) {
    console.log(`\n[${locale}] OK — all ${localeKeys.size} keys present`)
  } else {
    if (missing.length > 0) {
      console.log(`\n[${locale}] Missing ${missing.length} key(s):`)
      missing.forEach((k) => console.log(`  - ${k}`))
    }
    if (extra.length > 0) {
      console.log(`\n[${locale}] Extra ${extra.length} key(s) (not in en):`)
      extra.forEach((k) => console.log(`  + ${k}`))
    }
  }
}
