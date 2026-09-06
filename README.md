# vue-month-spinner-picker

An open-source project by [데브스랩(DevsLab)](https://devslab.kr/).

[![npm](https://img.shields.io/npm/v/vue-month-spinner-picker)](https://www.npmjs.com/package/vue-month-spinner-picker)
[![CI](https://github.com/jlc488/vue-month-spinner-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/jlc488/vue-month-spinner-picker/actions/workflows/ci.yml)
![Vue 3](https://img.shields.io/badge/Vue-3.3+-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)

**[Live demo](https://jlc488.github.io/vue-month-spinner-picker/)** · **[Edit on StackBlitz](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)** · **[CodeSandbox](https://codesandbox.io/s/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)** · [🇰🇷 한국어](./README.ko.md)

iOS-style drum-roll spinner month picker for Vue 3. A mobile-friendly month picker component with smooth inertia scrolling, bottom sheet modal, and full i18n support. Zero dependencies beyond Vue 3.

<p align="center">
  <img src="https://raw.githubusercontent.com/jlc488/vue-month-spinner-picker/main/docs/demo.gif" alt="vue-month-spinner-picker demo — bottom sheet opens and year/month drum-roll spinners scroll with inertia" width="390" />
</p>

## Features

- 🎰 iOS-style drum-roll spinner with inertia scrolling & rubber-band overscroll
- 🖱️ Mouse wheel scrolling & tap-to-select (desktop-friendly)
- 📱 Bottom sheet modal (mobile-optimized)
- 🌍 i18n support (English, Korean, Japanese built-in)
- 📅 Min/max month constraints
- ♿ ARIA attributes, keyboard navigation, Escape to close, focus trap
- 🎨 CSS Custom Properties for theming + opt-in dark theme
- 🎯 Overridable styles — global `vmp-` classes, no `!important` needed
- 🖥️ SSR-safe (Nuxt): no hydration mismatch
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
| `visibleCount` | `number` | `5` | Visible rows per spinner column |
| `itemHeight` | `number` | `40` | Spinner row height in px |

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

### Dark theme

A dark palette ships inside `style.css` and is opt-in via a `data-vmp-theme`
attribute. Put it on `<html>` or `<body>` — **not** on your app root: the modal
is teleported to `body`, so an attribute on `#app` would not reach it.

```html
<html data-vmp-theme="dark">
```

```ts
// toggling at runtime
document.documentElement.dataset.vmpTheme = isDark ? 'dark' : '';
```

Override any variable after importing `style.css` to adjust the palette:

```css
[data-vmp-theme='dark'] {
  --vmp-primary: #a78bfa;
}
```

### Overriding styles

Component styles are **global, not scoped** — every class is `vmp-`-prefixed and
carries single-class specificity, so a plain two-class selector wins without
`!important`:

```css
.my-picker .vmp-trigger {
  border-radius: 999px;
}
```

Import `style.css` before your own stylesheet so your rules come later in the
cascade. Tailwind users: utilities live in `@layer utilities` and lose to
unlayered CSS regardless of order, so reach for the important modifier
(`!rounded-full`) or set the `--vmp-*` variables instead:

```html
<MonthPicker v-model="month" class="[--vmp-primary:#6366f1]" />
```

### Spinner dimensions

```vue
<MonthPicker v-model="month" :visible-count="3" :item-height="32" />
```

## SSR / Nuxt

The component renders on the server without extra configuration. Auto-generated
ARIA ids come from Vue's `useId()` on Vue 3.5+, so they match between server
render and client hydration. On Vue 3.3/3.4 a module counter is used instead —
pass an explicit `id` if you serve SSR from a long-running Node process on those
versions.

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

## Family

- [@devslab/vue-date-rail](https://github.com/devslab-kr/vue-date-rail) — horizontal infinite-scroll date rail (day / month strip) picker; its `<MonthRail>` is the inline sibling of this bottom-sheet spinner ([live demo](https://devslab-kr.github.io/vue-date-rail/))

## Contributing

Bug reports, feature requests, and pull requests are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and PR guidelines.

## License

[MIT](./LICENSE)
