import { describe, it, expect } from 'vitest';
import {
  parseMonthValue,
  formatMonthValue,
  isValidMonthValue,
  generateYearRange,
  isMonthInRange,
  clampMonthToRange,
} from './utils';

describe('parseMonthValue', () => {
  it('parses valid YYYY-MM string', () => {
    expect(parseMonthValue('2024-01')).toEqual({ year: 2024, month: 1 });
    expect(parseMonthValue('2024-12')).toEqual({ year: 2024, month: 12 });
    expect(parseMonthValue('1999-06')).toEqual({ year: 1999, month: 6 });
  });

  it('returns null for invalid formats', () => {
    expect(parseMonthValue('')).toBeNull();
    expect(parseMonthValue('2024')).toBeNull();
    expect(parseMonthValue('2024-1')).toBeNull();
    expect(parseMonthValue('2024-00')).toBeNull();
    expect(parseMonthValue('2024-13')).toBeNull();
    expect(parseMonthValue('24-01')).toBeNull();
    expect(parseMonthValue('abcd-01')).toBeNull();
    expect(parseMonthValue('2024/01')).toBeNull();
  });
});

describe('formatMonthValue', () => {
  it('formats year and month to YYYY-MM', () => {
    expect(formatMonthValue(2024, 1)).toBe('2024-01');
    expect(formatMonthValue(2024, 12)).toBe('2024-12');
    expect(formatMonthValue(1999, 6)).toBe('1999-06');
  });

  it('zero-pads year if needed', () => {
    expect(formatMonthValue(500, 3)).toBe('0500-03');
  });
});

describe('isValidMonthValue', () => {
  it('returns true for valid YYYY-MM strings', () => {
    expect(isValidMonthValue('2024-01')).toBe(true);
    expect(isValidMonthValue('2024-12')).toBe(true);
    expect(isValidMonthValue('0001-06')).toBe(true);
  });

  it('returns false for invalid strings', () => {
    expect(isValidMonthValue('')).toBe(false);
    expect(isValidMonthValue('2024-00')).toBe(false);
    expect(isValidMonthValue('2024-13')).toBe(false);
    expect(isValidMonthValue('2024-1')).toBe(false);
    expect(isValidMonthValue('abc')).toBe(false);
  });
});

describe('generateYearRange', () => {
  it('generates range from provided [min, max]', () => {
    expect(generateYearRange([2020, 2023])).toEqual([2020, 2021, 2022, 2023]);
  });

  it('generates single-year range', () => {
    expect(generateYearRange([2024, 2024])).toEqual([2024]);
  });

  it('falls back to default when min > max', () => {
    const result = generateYearRange([2025, 2020]);
    const now = new Date().getFullYear();
    expect(result[0]).toBe(now - 10);
    expect(result[result.length - 1]).toBe(now + 5);
  });

  it('falls back to default when not provided', () => {
    const result = generateYearRange();
    const now = new Date().getFullYear();
    expect(result.length).toBe(16); // 10 + 1 + 5
    expect(result[0]).toBe(now - 10);
    expect(result[result.length - 1]).toBe(now + 5);
  });
});

describe('isMonthInRange', () => {
  it('returns true when no bounds', () => {
    expect(isMonthInRange(2024, 6)).toBe(true);
  });

  it('respects minMonth', () => {
    expect(isMonthInRange(2024, 6, '2024-06')).toBe(true);
    expect(isMonthInRange(2024, 5, '2024-06')).toBe(false);
    expect(isMonthInRange(2024, 7, '2024-06')).toBe(true);
  });

  it('respects maxMonth', () => {
    expect(isMonthInRange(2024, 6, undefined, '2024-06')).toBe(true);
    expect(isMonthInRange(2024, 7, undefined, '2024-06')).toBe(false);
    expect(isMonthInRange(2024, 5, undefined, '2024-06')).toBe(true);
  });

  it('respects both min and max', () => {
    expect(isMonthInRange(2024, 6, '2024-01', '2024-12')).toBe(true);
    expect(isMonthInRange(2023, 12, '2024-01', '2024-12')).toBe(false);
    expect(isMonthInRange(2025, 1, '2024-01', '2024-12')).toBe(false);
  });

  it('ignores invalid minMonth/maxMonth strings', () => {
    expect(isMonthInRange(2024, 6, 'invalid')).toBe(true);
    expect(isMonthInRange(2024, 6, undefined, 'invalid')).toBe(true);
  });
});

describe('clampMonthToRange', () => {
  it('returns input unchanged when in range', () => {
    expect(clampMonthToRange(2024, 6, '2024-01', '2024-12')).toEqual({ year: 2024, month: 6 });
    expect(clampMonthToRange(2024, 6)).toEqual({ year: 2024, month: 6 });
  });

  it('clamps to minMonth when below range', () => {
    expect(clampMonthToRange(2023, 12, '2024-03')).toEqual({ year: 2024, month: 3 });
    expect(clampMonthToRange(2024, 2, '2024-03')).toEqual({ year: 2024, month: 3 });
  });

  it('clamps to maxMonth when above range', () => {
    expect(clampMonthToRange(2025, 1, undefined, '2024-10')).toEqual({ year: 2024, month: 10 });
    expect(clampMonthToRange(2024, 11, undefined, '2024-10')).toEqual({ year: 2024, month: 10 });
  });

  it('treats boundaries as inclusive', () => {
    expect(clampMonthToRange(2024, 3, '2024-03', '2024-10')).toEqual({ year: 2024, month: 3 });
    expect(clampMonthToRange(2024, 10, '2024-03', '2024-10')).toEqual({ year: 2024, month: 10 });
  });

  it('ignores invalid bound strings', () => {
    expect(clampMonthToRange(2024, 6, 'invalid', 'also-invalid')).toEqual({ year: 2024, month: 6 });
  });
});
