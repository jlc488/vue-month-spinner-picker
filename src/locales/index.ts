import en from './en';
import ko from './ko';
import ja from './ja';
import type { LocaleConfig } from '../types';

export { en, ko, ja };

/**
 * Merge partial locale config with English defaults.
 * If months array is not exactly 12 items, falls back to English months.
 */
export function mergeLocale(locale?: Partial<LocaleConfig>): LocaleConfig {
  if (!locale) return { ...en };

  const merged = { ...en, ...locale };

  // Validate months array - must be exactly 12 items
  if (!Array.isArray(merged.months) || merged.months.length !== 12) {
    merged.months = [...en.months];
  }

  return merged;
}
