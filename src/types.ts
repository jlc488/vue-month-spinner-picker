import type { Ref, ComputedRef } from 'vue';

// ============================================================
// LocaleConfig
// ============================================================

export interface LocaleConfig {
  months: string[];                // 12 month names
  confirmText: string;
  cancelText: string;
  title: string;
  yearSuffix?: string;            // e.g., "년", "年"
  monthSuffix?: string;           // e.g., "월", "月"
}

// ============================================================
// MonthPicker
// ============================================================

export interface MonthPickerProps {
  modelValue: string;              // "YYYY-MM" format
  label?: string;
  placeholder?: string;            // default: "Select month"
  disabled?: boolean;              // default: false
  required?: boolean;              // default: false
  minMonth?: string;               // "YYYY-MM" minimum selectable month
  maxMonth?: string;               // "YYYY-MM" maximum selectable month
  yearRange?: [number, number];    // [startYear, endYear]
  errorMessage?: string;
  locale?: LocaleConfig;
  teleportTo?: string;             // modal teleport target (default: "body")
  id?: string;
}

export interface MonthPickerEmits {
  'update:modelValue': [value: string];
  'change': [value: string];
  'open': [];
  'close': [];
}

export interface MonthPickerExposed {
  openPicker: () => void;
  closePicker: () => void;
}

// ============================================================
// SpinnerColumn
// ============================================================

export interface SpinnerItem {
  value: number | string;
  label: string;
  disabled?: boolean;
}

export interface SpinnerColumnProps {
  items: SpinnerItem[];
  modelValue: number | string;
  visibleCount?: number;           // default: 5
  itemHeight?: number;             // default: 40
}

export interface SpinnerColumnEmits {
  'update:modelValue': [value: number | string];
}

// ============================================================
// PickerModal
// ============================================================

export interface PickerModalProps {
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  teleportTo?: string;               // teleport target (default: "body")
}

export interface PickerModalEmits {
  'confirm': [];
  'cancel': [];
  'dismiss': [];
}

// ============================================================
// Composables
// ============================================================

export interface UseSpinnerOptions {
  items: Ref<SpinnerItem[]>;
  selectedValue: Ref<number | string>;
  itemHeight: number;
  visibleCount: number;
}

export interface UseSpinnerReturn {
  containerRef: Ref<HTMLElement | null>;
  currentOffset: Ref<number>;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onMouseDown: (e: MouseEvent) => void;
  onWheel: (e: WheelEvent) => void;
  onItemClick: (index: number) => void;
  scrollToValue: (value: number | string) => void;
  selectedIndex: ComputedRef<number>;
}

export interface UseBottomSheetOptions {
  onDismiss?: () => void;
}

export interface UseBottomSheetReturn {
  sheetRef: Ref<HTMLElement | null>;
  backdropRef: Ref<HTMLElement | null>;
  isVisible: Ref<boolean>;
  open: () => void;
  close: () => void;
}
