<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SpinnerColumn from './SpinnerColumn.vue';
import PickerModal from './PickerModal.vue';
import { mergeLocale } from '../locales';
import { parseMonthValue, formatMonthValue, isValidMonthValue, generateYearRange, isMonthInRange } from '../utils';
import type { LocaleConfig, SpinnerItem } from '../types';

const props = withDefaults(defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minMonth?: string;
  maxMonth?: string;
  yearRange?: [number, number];
  errorMessage?: string;
  locale?: LocaleConfig;
  teleportTo?: string;
  id?: string;
}>(), {
  placeholder: 'Select month',
  disabled: false,
  required: false,
  teleportTo: 'body',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
  'open': [];
  'close': [];
}>();

// Generate unique ID for ARIA
const componentId = computed(() => props.id || `vmp-${Math.random().toString(36).slice(2, 9)}`);
const errorId = computed(() => `${componentId.value}-error`);

// Locale
const resolvedLocale = computed(() => mergeLocale(props.locale));

// Modal state
const isModalOpen = ref(false);

// Temporary values while picker is open
const tempYear = ref(new Date().getFullYear());
const tempMonth = ref(new Date().getMonth() + 1);

// Year items for spinner
const yearItems = computed<SpinnerItem[]>(() => {
  const years = generateYearRange(props.yearRange);
  return years.map(y => ({
    value: y,
    label: resolvedLocale.value.yearSuffix ? `${y}${resolvedLocale.value.yearSuffix}` : String(y),
  }));
});

// Month items for spinner (with disabled state based on min/max and selected year)
const monthItems = computed<SpinnerItem[]>(() => {
  return resolvedLocale.value.months.map((name, idx) => {
    const month = idx + 1;
    const disabled = !isMonthInRange(tempYear.value, month, props.minMonth, props.maxMonth);
    return {
      value: month,
      label: name,
      disabled,
    };
  });
});

// Display text for trigger button
const displayText = computed(() => {
  if (!props.modelValue || !isValidMonthValue(props.modelValue)) {
    return '';
  }
  const parsed = parseMonthValue(props.modelValue);
  if (!parsed) return '';
  const monthName = resolvedLocale.value.months[parsed.month - 1];
  const yearSuffix = resolvedLocale.value.yearSuffix || '';
  return `${parsed.year}${yearSuffix} ${monthName}`;
});

const hasValue = computed(() => !!displayText.value);

// Open picker
function openPicker() {
  if (props.disabled) return;

  // Initialize temp values from modelValue
  if (props.modelValue && isValidMonthValue(props.modelValue)) {
    const parsed = parseMonthValue(props.modelValue)!;
    tempYear.value = parsed.year;
    tempMonth.value = parsed.month;
  } else {
    const now = new Date();
    tempYear.value = now.getFullYear();
    tempMonth.value = now.getMonth() + 1;
  }

  isModalOpen.value = true;
  emit('open');
}

// Close picker without confirming
function closePicker() {
  isModalOpen.value = false;
  emit('close');
}

// Confirm selection
function onConfirm() {
  const value = formatMonthValue(tempYear.value, tempMonth.value);
  emit('update:modelValue', value);
  emit('change', value);
  closePicker();
}

// Cancel
function onCancel() {
  closePicker();
}

// Dismiss (backdrop click)
function onDismiss() {
  closePicker();
}

// When year changes, re-check if current month is still valid
watch(tempYear, () => {
  if (!isMonthInRange(tempYear.value, tempMonth.value, props.minMonth, props.maxMonth)) {
    // Find nearest valid month forward
    for (let m = tempMonth.value; m <= 12; m++) {
      if (isMonthInRange(tempYear.value, m, props.minMonth, props.maxMonth)) {
        tempMonth.value = m;
        return;
      }
    }
    // Find nearest valid month backward
    for (let m = tempMonth.value; m >= 1; m--) {
      if (isMonthInRange(tempYear.value, m, props.minMonth, props.maxMonth)) {
        tempMonth.value = m;
        return;
      }
    }
  }
});

// Expose methods
defineExpose({
  openPicker,
  closePicker,
});
</script>

<template>
  <div class="vmp-month-picker" :class="{ 'vmp-month-picker--disabled': disabled, 'vmp-month-picker--error': errorMessage }">
    <!-- Label -->
    <label v-if="label" :for="componentId" class="vmp-label">
      {{ label }}
      <span v-if="required" class="vmp-required">*</span>
    </label>

    <!-- Trigger (slot or default button) -->
    <slot name="trigger" :open="openPicker" :value="modelValue" :display-text="displayText">
      <button
        type="button"
        :id="componentId"
        class="vmp-trigger"
        :class="{ 'vmp-trigger--has-value': hasValue }"
        :disabled="disabled"
        :aria-label="label || placeholder"
        :aria-expanded="isModalOpen"
        :aria-required="required || undefined"
        :aria-invalid="!!errorMessage || undefined"
        :aria-describedby="errorMessage ? errorId : undefined"
        @click="openPicker"
      >
        <span v-if="hasValue" class="vmp-trigger-text">{{ displayText }}</span>
        <span v-else class="vmp-trigger-placeholder">{{ placeholder }}</span>
        <span class="vmp-trigger-icon">▼</span>
      </button>
    </slot>

    <!-- Error message -->
    <div v-if="errorMessage" :id="errorId" class="vmp-error" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Picker Modal -->
    <PickerModal
      :is-open="isModalOpen"
      :title="resolvedLocale.title"
      :confirm-text="resolvedLocale.confirmText"
      :cancel-text="resolvedLocale.cancelText"
      @confirm="onConfirm"
      @cancel="onCancel"
      @dismiss="onDismiss"
    >
      <SpinnerColumn
        :items="yearItems"
        v-model="tempYear"
      />
      <SpinnerColumn
        :items="monthItems"
        v-model="tempMonth"
      />
    </PickerModal>
  </div>
</template>

<style scoped>
.vmp-month-picker {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--vmp-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
}

.vmp-label {
  font-size: var(--vmp-font-size-sm, 13px);
  color: var(--vmp-text-primary, #1a1a1a);
  font-weight: 500;
}

.vmp-required {
  color: var(--vmp-error, #ff3b30);
  margin-left: 2px;
}

.vmp-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--vmp-border, #c6c6c8);
  border-radius: calc(var(--vmp-radius, 12px) - 4px);
  background: var(--vmp-background, #ffffff);
  cursor: pointer;
  font-size: var(--vmp-font-size-md, 16px);
  font-family: inherit;
  min-width: 180px;
  transition: border-color 0.2s;
}

.vmp-trigger:hover:not(:disabled) {
  border-color: var(--vmp-primary, #007aff);
}

.vmp-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--vmp-surface, #f2f2f7);
}

.vmp-trigger-text {
  color: var(--vmp-text-primary, #1a1a1a);
}

.vmp-trigger-placeholder {
  color: var(--vmp-text-secondary, #8e8e93);
}

.vmp-trigger-icon {
  font-size: 10px;
  color: var(--vmp-text-secondary, #8e8e93);
}

.vmp-month-picker--error .vmp-trigger {
  border-color: var(--vmp-error, #ff3b30);
}

.vmp-error {
  font-size: var(--vmp-font-size-sm, 13px);
  color: var(--vmp-error, #ff3b30);
}

.vmp-month-picker--disabled {
  opacity: 0.5;
}
</style>
