# vue-month-spinner-picker

[데브스랩(DevsLab)](https://devslab.kr/)의 오픈소스 프로젝트입니다.

[![npm](https://img.shields.io/npm/v/vue-month-spinner-picker)](https://www.npmjs.com/package/vue-month-spinner-picker)
[![CI](https://github.com/jlc488/vue-month-spinner-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/jlc488/vue-month-spinner-picker/actions/workflows/ci.yml)
![Vue 3](https://img.shields.io/badge/Vue-3.3+-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)

**[라이브 데모](https://jlc488.github.io/vue-month-spinner-picker/)** · **[StackBlitz에서 편집](https://stackblitz.com/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)** · **[CodeSandbox](https://codesandbox.io/s/github/jlc488/vue-month-spinner-picker/tree/main/examples/basic)** · [🇺🇸 English](./README.md)

Vue 3용 iOS 스타일 드럼롤 스피너 월 선택기. 관성 스크롤이 적용된 모바일 친화적 월 선택 컴포넌트입니다. 바텀시트 모달, 다국어 지원, Vue 3 외 의존성 없음.

<p align="center">
  <img src="https://raw.githubusercontent.com/jlc488/vue-month-spinner-picker/main/docs/demo.gif" alt="vue-month-spinner-picker 데모 — 바텀시트가 열리고 연/월 드럼롤 스피너가 관성 스크롤되는 모습" width="390" />
</p>

## 특징

- 🎰 관성 스크롤 + 러버밴드 오버스크롤이 적용된 iOS 스타일 드럼롤 스피너
- 🖱️ 마우스 휠 스크롤 & 탭하여 선택 (데스크톱 친화적)
- 📱 바텀시트 모달 (모바일 최적화)
- 🌍 다국어 지원 (영어, 한국어, 일본어 기본 제공)
- 📅 최소/최대 월 제약 설정
- ♿ ARIA 속성, 키보드 네비게이션, Escape로 닫기, 포커스 트랩
- 🎨 CSS Custom Properties로 테마 커스터마이징 + 다크 테마 (opt-in)
- 🎯 스타일 오버라이드 가능 — 전역 `vmp-` 클래스, `!important` 불필요
- 🖥️ SSR 안전 (Nuxt) — 하이드레이션 불일치 없음
- 📦 ESM + CJS + TypeScript 선언 파일
- 🪶 경량 — Vue 3 외 의존성 없음

## 설치

```bash
npm install vue-month-spinner-picker
```

## 빠른 시작

```vue
<script setup>
import { ref } from 'vue';
import MonthPicker from 'vue-month-spinner-picker';
import 'vue-month-spinner-picker/style.css';

const month = ref('2025-06');
</script>

<template>
  <MonthPicker v-model="month" label="월 선택" />
</template>
```

## 사용법

### 기본 사용

```vue
<MonthPicker v-model="month" />
```

### 범위 제약

```vue
<MonthPicker
  v-model="month"
  min-month="2024-01"
  max-month="2026-12"
  :year-range="[2020, 2030]"
/>
```

### 한국어 로케일

```vue
<script setup>
import { MonthPicker, ko } from 'vue-month-spinner-picker';
</script>

<template>
  <MonthPicker v-model="month" :locale="ko" />
</template>
```

### 커스텀 로케일

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

### 커스텀 트리거

```vue
<MonthPicker v-model="month">
  <template #trigger="{ open, displayText }">
    <button @click="open">
      {{ displayText || '월을 선택하세요' }}
    </button>
  </template>
</MonthPicker>
```


### 유효성 검사 및 에러 상태

```vue
<MonthPicker
  v-model="month"
  required
  error-message="월을 선택해주세요"
/>
```

### 프로그래밍 방식 제어

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
  <button @click="openFromCode">피커 열기</button>
</template>
```

### 전역 등록 (Vue 플러그인)

```ts
import { createApp } from 'vue';
import { MonthPickerPlugin } from 'vue-month-spinner-picker';
import 'vue-month-spinner-picker/style.css';

const app = createApp(App);
app.use(MonthPickerPlugin); // <MonthPicker>를 전역 컴포넌트로 등록
app.mount('#app');
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `modelValue` | `string` | — | 선택된 월 (`YYYY-MM` 포맷, v-model) |
| `label` | `string` | — | 트리거 위에 표시되는 라벨 |
| `placeholder` | `string` | `'Select month'` | 값이 없을 때 표시되는 텍스트 |
| `disabled` | `boolean` | `false` | 비활성화 |
| `required` | `boolean` | `false` | 필수 표시 (별표) |
| `minMonth` | `string` | — | 선택 가능한 최소 월 (`YYYY-MM`) |
| `maxMonth` | `string` | — | 선택 가능한 최대 월 (`YYYY-MM`) |
| `yearRange` | `[number, number]` | `[현재-10, 현재+5]` | 년도 범위 `[시작년도, 끝년도]` |
| `errorMessage` | `string` | — | 에러 메시지 |
| `locale` | `LocaleConfig` | 영어 | 로케일 설정 |
| `teleportTo` | `string` | `'body'` | 모달 Teleport 대상 |
| `id` | `string` | 자동 | ARIA용 HTML id |
| `visibleCount` | `number` | `5` | 스피너 컬럼에 보이는 행 수 |
| `itemHeight` | `number` | `40` | 스피너 행 높이 (px) |

## 이벤트

| 이벤트 | 페이로드 | 설명 |
|--------|----------|------|
| `update:modelValue` | `string` | 확인 시 발생 (`YYYY-MM`) |
| `change` | `string` | 확인 시 발생 (`YYYY-MM`) |
| `open` | — | 피커 열림 |
| `close` | — | 피커 닫힘 |

## 슬롯

| 슬롯 | Props | 설명 |
|------|-------|------|
| `trigger` | `{ open, value, displayText }` | 커스텀 트리거 요소 |

## 테마 커스터마이징

CSS Custom Properties로 모든 시각적 요소를 커스터마이징할 수 있습니다:

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

### 다크 테마

다크 팔레트는 `style.css`에 함께 들어 있고, `data-vmp-theme` 속성으로 켭니다.
이 속성은 앱 루트가 아니라 **`<html>` 또는 `<body>`에** 붙여야 합니다 — 모달이
`body`로 teleport되므로 `#app`에 붙인 속성은 모달까지 도달하지 않습니다.

```html
<html data-vmp-theme="dark">
```

```ts
// 런타임 토글
document.documentElement.dataset.vmpTheme = isDark ? 'dark' : '';
```

팔레트를 조정하려면 `style.css` import 뒤에서 변수를 덮어쓰면 됩니다:

```css
[data-vmp-theme='dark'] {
  --vmp-primary: #a78bfa;
}
```

### 스타일 오버라이드

컴포넌트 스타일은 **scoped가 아니라 전역**입니다. 모든 클래스가 `vmp-`
프리픽스이고 명시도가 클래스 1개이므로, 클래스 2개짜리 셀렉터면 `!important`
없이 이깁니다:

```css
.my-picker .vmp-trigger {
  border-radius: 999px;
}
```

`style.css`를 본인 스타일시트보다 **먼저** import하세요 — 명시도가 같을 때는
나중에 선언된 쪽이 이깁니다. Tailwind를 쓴다면, 유틸리티는 `@layer utilities`에
있어서 순서와 무관하게 레이어 없는 CSS에 지므로 important modifier
(`!rounded-full`)를 쓰거나 `--vmp-*` 변수를 직접 지정하세요:

```html
<MonthPicker v-model="month" class="[--vmp-primary:#6366f1]" />
```

### 스피너 치수

```vue
<MonthPicker v-model="month" :visible-count="3" :item-height="32" />
```

## SSR / Nuxt

별도 설정 없이 서버 렌더링됩니다. 자동 생성되는 ARIA id는 Vue 3.5+에서 Vue의
`useId()`를 사용하므로 서버 렌더 결과와 클라이언트 하이드레이션이 일치합니다.
Vue 3.3/3.4에서는 모듈 카운터로 대체되므로, 해당 버전에서 장시간 구동되는 Node
프로세스로 SSR을 서비스한다면 `id`를 명시적으로 넘기세요.

## 기본 제공 로케일

```ts
import { en, ko, ja } from 'vue-month-spinner-picker';
```

| 로케일 | 언어 |
|--------|------|
| `en` | English (기본) |
| `ko` | 한국어 |
| `ja` | 日本語 |

## 유틸리티 함수

```ts
import { parseMonthValue, formatMonthValue, isValidMonthValue } from 'vue-month-spinner-picker';

parseMonthValue('2025-06');      // { year: 2025, month: 6 }
formatMonthValue(2025, 6);       // '2025-06'
isValidMonthValue('2025-06');    // true
isValidMonthValue('2025-13');    // false
```

## TypeScript

모든 타입 정의가 포함되어 있습니다:

```ts
import type {
  MonthPickerProps,
  MonthPickerEmits,
  MonthPickerExposed,
  LocaleConfig,
  SpinnerItem,
} from 'vue-month-spinner-picker';
```

## 브라우저 지원

Vue 3를 지원하는 모든 최신 브라우저에서 동작합니다. 터치 및 마우스 입력 모두 지원.

## Family

- [@devslab/vue-date-rail](https://github.com/devslab-kr/vue-date-rail) — 가로 무한 스크롤 날짜 레일(일/월 스트립) 피커. 그 안의 `<MonthRail>`이 이 바텀시트 스피너의 인라인 형제입니다 ([라이브 데모](https://devslab-kr.github.io/vue-date-rail/))

## 기여하기

버그 리포트, 기능 제안, PR 모두 환영합니다 — 개발 환경 설정과 PR 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.

## 라이선스

[MIT](./LICENSE)
