# vue-month-spinner-picker

[🇰🇷 한국어](./README.ko.md)

iOS-style drum-roll spinner month picker for Vue 3.

![Vue 3](https://img.shields.io/badge/Vue-3.3+-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A mobile-friendly month picker component with smooth inertia scrolling, bottom sheet modal, and full i18n support. Zero dependencies beyond Vue 3.

[📺 Live Demo](https://jlc488.github.io/vue-month-spinner-picker/) · Try it online: [⚡ StackBlitz](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic) | [📦 CodeSandbox](https://codesandbox.io/s/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)

## Features

- 🎰 iOS-style drum-roll spinner with inertia scrolling & rubber-band overscroll
- 🖱️ Mouse wheel scrolling & tap-to-select (desktop-friendly)
- 📱 Bottom sheet modal (mobile-optimized)
- 🌍 i18n support (English, Korean, Japanese built-in)
- 📅 Min/max month constraints
- ♿ ARIA attributes, keyboard navigation, Escape to close, focus trap
- 🎨 CSS Custom Properties for theming
- 📦 ESM + CJS + TypeScript declarations
- 🪶 Lightweight — no dependencies beyond Vue 3

## Installation

```bash
npm install vue-month-spinner-picker
```

## Quick Start

```vue
<script setup>
import { ref } from 'vue';
import MonthPicker from 'vue-month-spinner-picker';
import 'vue-month-spinner-picker/style.css';

const month = ref('2025-06');
</script>

<template>
  <MonthPicker v-model="month" label="Select Month" />
</template>
```

## Usage

### Basic

```vue
<MonthPicker v-model="month" />
```

### With constraints

```vue
<MonthPicker
  v-model="month"
  min-month="2024-01"
  max-month="2026-12"
  :year-range="[2020, 2030]"
/>
```

### With locale

```vue
<script setup>
import { MonthPicker, ko } from 'vue-month-spinner-picker';
</script>

<template>
  <MonthPicker v-model="month" :locale="ko" />
</template>
```

### Custom locale

```vue
<script setup>
import { MonthPicker, mergeLocale } from 'vue-month-spinner-picker';

const zhTW = mergeLocale({
  months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  confirmText: '確認',
  cancelText: '取消',
  title: '選擇月份',
  yearSuffix: '年',
});
</script>

<template>
  <MonthPicker v-model="month" :locale="zhTW" />
</template>
```

### Custom trigger

```vue
<MonthPicker v-model="month">
  <template #trigger="{ open, displayText }">
    <button @click="open">
      {{ displayText || 'Pick a month' }}
    </button>
  </template>
</MonthPicker>
```


### Validation & error state

```vue
<MonthPicker
  v-model="month"
  required
  error-message="Month is required"
/>
```

### Programmatic control

```vue
<script setup>
import { ref } from 'vue';

const pickerRef = ref();

function openFromCode() {
  pickerRef.value.openPicker();
}
</script>

<template>
  <MonthPicker ref="pickerRef" v-model="month" />
  <button @click="openFromCode">Open Picker</button>
</template>
```

### Global registration (Vue plugin)

```ts
import { createApp } from 'vue';
import { MonthPickerPlugin } from 'vue-month-spinner-picker';
import 'vue-month-spinner-picker/style.css';

const app = createApp(App);
app.use(MonthPickerPlugin); // registers <MonthPicker> globally
app.mount('#app');
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Selected month in `YYYY-MM` format (v-model) |
| `label` | `string` | — | Label text above the trigger |
| `placeholder` | `string` | `'Select month'` | Placeholder when no value selected |
| `disabled` | `boolean` | `false` | Disable the picker |
| `required` | `boolean` | `false` | Mark as required (shows asterisk) |
| `minMonth` | `string` | — | Minimum selectable month (`YYYY-MM`) |
| `maxMonth` | `string` | — | Maximum selectable month (`YYYY-MM`) |
| `yearRange` | `[number, number]` | `[now-10, now+5]` | Year range `[startYear, endYear]` |
| `errorMessage` | `string` | — | Error message to display |
| `locale` | `LocaleConfig` | English | Locale configuration |
| `teleportTo` | `string` | `'body'` | Teleport target for the modal |
| `id` | `string` | auto | HTML id for ARIA |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted on confirm (`YYYY-MM`) |
| `change` | `string` | Emitted on confirm (`YYYY-MM`) |
| `open` | — | Picker opened |
| `close` | — | Picker closed |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `trigger` | `{ open, value, displayText }` | Custom trigger element |

## Theming

All visual aspects can be customized via CSS Custom Properties:

```css
.my-theme {
  --vmp-primary: #6366f1;
  --vmp-background: #ffffff;
  --vmp-surface: #f2f2f7;
  --vmp-text-primary: #1a1a1a;
  --vmp-text-secondary: #8e8e93;
  --vmp-border: #c6c6c8;
  --vmp-error: #ff3b30;
  --vmp-radius: 12px;
  --vmp-font-family: 'Inter', sans-serif;
  --vmp-font-size-sm: 13px;
  --vmp-font-size-md: 16px;
  --vmp-font-size-lg: 20px;
  --vmp-backdrop: rgba(0, 0, 0, 0.4);
  --vmp-spinner-highlight-bg: rgba(0, 122, 255, 0.08);
  --vmp-spinner-fade-color: #ffffff;
}
```

## Built-in Locales

```ts
import { en, ko, ja } from 'vue-month-spinner-picker';
```

| Locale | Language |
|--------|----------|
| `en` | English (default) |
| `ko` | 한국어 |
| `ja` | 日本語 |

## Utility Functions

```ts
import { parseMonthValue, formatMonthValue, isValidMonthValue } from 'vue-month-spinner-picker';

parseMonthValue('2025-06');      // { year: 2025, month: 6 }
formatMonthValue(2025, 6);       // '2025-06'
isValidMonthValue('2025-06');    // true
isValidMonthValue('2025-13');    // false
```

## TypeScript

Full type definitions are included. Key types:

```ts
import type {
  MonthPickerProps,
  MonthPickerEmits,
  MonthPickerExposed,
  LocaleConfig,
  SpinnerItem,
} from 'vue-month-spinner-picker';
```

## Browser Support

Works in all modern browsers that support Vue 3. Touch and mouse input both supported.

## License

[MIT](./LICENSE)
