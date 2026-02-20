import type { App } from 'vue';
import MonthPicker from './components/MonthPicker.vue';
import SpinnerColumn from './components/SpinnerColumn.vue';
import PickerModal from './components/PickerModal.vue';

// Component exports
export { MonthPicker, SpinnerColumn, PickerModal };
export default MonthPicker;

// Type re-exports
export type {
  MonthPickerProps,
  MonthPickerEmits,
  MonthPickerExposed,
  SpinnerColumnProps,
  SpinnerColumnEmits,
  SpinnerItem,
  PickerModalProps,
  PickerModalEmits,
  LocaleConfig,
  UseSpinnerOptions,
  UseSpinnerReturn,
  UseBottomSheetOptions,
  UseBottomSheetReturn,
} from './types';

// Locale preset exports
export { en, ko, ja, mergeLocale } from './locales';

// Utility function exports
export { parseMonthValue, formatMonthValue, isValidMonthValue } from './utils';

// Vue plugin
export const MonthPickerPlugin = {
  install(app: App) {
    app.component('MonthPicker', MonthPicker);
  },
};
