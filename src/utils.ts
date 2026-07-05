/**
 * Utility functions for vue-month-spinner-picker
 */

const MONTH_VALUE_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * Parse "YYYY-MM" string to { year, month } object.
 * Returns null for invalid format.
 * month is 1-12.
 */
export function parseMonthValue(value: string): { year: number; month: number } | null {
  if (!MONTH_VALUE_REGEX.test(value)) {
    return null;
  }
  const [yearStr, monthStr] = value.split('-');
  return { year: Number(yearStr), month: Number(monthStr) };
}

/**
 * Format year and month to "YYYY-MM" string.
 * Month is zero-padded (e.g., "01", "02", ... "12").
 */
export function formatMonthValue(year: number, month: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * Validate if string matches "YYYY-MM" format.
 * Year must be 4 digits, month must be 01-12.
 */
export function isValidMonthValue(value: string): boolean {
  return MONTH_VALUE_REGEX.test(value);
}

/**
 * Generate an array of years from a range.
 * - If yearRange [min, max] provided and min <= max, returns min..max inclusive.
 * - Otherwise falls back to currentYear - 10 .. currentYear + 5.
 */
export function generateYearRange(yearRange?: [number, number]): number[] {
  let min: number;
  let max: number;

  if (
    yearRange &&
    Array.isArray(yearRange) &&
    yearRange.length === 2 &&
    Number.isFinite(yearRange[0]) &&
    Number.isFinite(yearRange[1]) &&
    yearRange[0] <= yearRange[1]
  ) {
    min = yearRange[0];
    max = yearRange[1];
  } else {
    const now = new Date().getFullYear();
    min = now - 10;
    max = now + 5;
  }

  const years: number[] = [];
  for (let y = min; y <= max; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Check if a year-month is within [minMonth, maxMonth] range.
 * - If minMonth not provided, no lower bound.
 * - If maxMonth not provided, no upper bound.
 * - Compares as YYYYMM numeric values.
 */
/**
 * Clamp a year-month to the [minMonth, maxMonth] range.
 * Returns the nearest boundary when out of range, otherwise the input unchanged.
 */
export function clampMonthToRange(
  year: number,
  month: number,
  minMonth?: string,
  maxMonth?: string,
): { year: number; month: number } {
  const val = year * 100 + month;

  const minParsed = minMonth ? parseMonthValue(minMonth) : null;
  if (minParsed && val < minParsed.year * 100 + minParsed.month) {
    return { year: minParsed.year, month: minParsed.month };
  }

  const maxParsed = maxMonth ? parseMonthValue(maxMonth) : null;
  if (maxParsed && val > maxParsed.year * 100 + maxParsed.month) {
    return { year: maxParsed.year, month: maxParsed.month };
  }

  return { year, month };
}

export function isMonthInRange(
  year: number,
  month: number,
  minMonth?: string,
  maxMonth?: string,
): boolean {
  const val = year * 100 + month;

  if (minMonth) {
    const parsed = parseMonthValue(minMonth);
    if (parsed) {
      const minVal = parsed.year * 100 + parsed.month;
      if (val < minVal) return false;
    }
  }

  if (maxMonth) {
    const parsed = parseMonthValue(maxMonth);
    if (parsed) {
      const maxVal = parsed.year * 100 + parsed.month;
      if (val > maxVal) return false;
    }
  }

  return true;
}
