<script setup lang="ts">
import { ref } from 'vue';
import MonthPicker from '../src/components/MonthPicker.vue';
import { ko } from '../src/locales';
import { mergeLocale } from '../src/locales';

const month1 = ref('2025-06');
const month2 = ref('');
const month3 = ref('2025-03');
const month4 = ref('2025-01');
const month5 = ref('2025-08');
const month6 = ref('2025-09');

// Dark theme is opt-in via an attribute on <html>, so it also reaches the
// bottom sheet — which is teleported to <body>, outside the app root.
const isDark = ref(false);
function toggleDark() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.dataset.vmpTheme = 'dark';
  } else {
    delete document.documentElement.dataset.vmpTheme;
  }
}

const zhTW = mergeLocale({
  months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  confirmText: '確認',
  cancelText: '取消',
  title: '選擇月份',
  yearSuffix: '年',
});
</script>

<template>
  <div class="demo">
    <h1>🎰 vue-month-spinner-picker Demo</h1>

    <div class="theme-bar">
      <button class="theme-toggle" @click="toggleDark">
        {{ isDark ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </div>

    <section>
      <h2>Basic (English)</h2>
      <MonthPicker v-model="month1" label="Select Month" />
      <p class="value">v-model: <code>{{ month1 }}</code></p>
    </section>

    <section>
      <h2>한국어 로케일</h2>
      <MonthPicker v-model="month2" label="월 선택" placeholder="월을 선택하세요" :locale="ko" />
      <p class="value">v-model: <code>{{ month2 || '(empty)' }}</code></p>
    </section>

    <section>
      <h2>Min/Max 제약</h2>
      <MonthPicker
        v-model="month3"
        label="2025년만 선택 가능"
        min-month="2025-01"
        max-month="2025-12"
        :locale="ko"
      />
      <p class="value">v-model: <code>{{ month3 }}</code></p>
    </section>

    <section>
      <h2>繁體中文 (Custom Locale)</h2>
      <MonthPicker v-model="month4" label="選擇月份" :locale="zhTW" />
      <p class="value">v-model: <code>{{ month4 }}</code></p>
    </section>

    <section>
      <h2>Disabled</h2>
      <MonthPicker model-value="2025-06" label="Disabled Picker" disabled />
    </section>

    <section>
      <h2>Error State</h2>
      <MonthPicker model-value="" label="Required Field" required error-message="월을 선택해주세요" :locale="ko" />
    </section>

    <section>
      <h2>Compact Spinner (3 rows × 32px)</h2>
      <MonthPicker v-model="month5" label="Compact" :visible-count="3" :item-height="32" />
      <p class="value">v-model: <code>{{ month5 }}</code></p>
    </section>

    <section>
      <h2>Tall Spinner (7 rows × 44px)</h2>
      <MonthPicker v-model="month6" label="Tall" :visible-count="7" :item-height="44" />
      <p class="value">v-model: <code>{{ month6 }}</code></p>
    </section>

    <section>
      <h2>Style Override (plain CSS, no !important)</h2>
      <MonthPicker v-model="month1" label="Branded" class="branded" />
      <p class="value">Styles are global, so <code>.branded .vmp-trigger</code> wins</p>
    </section>

    <section>
      <h2>Custom Trigger Slot</h2>
      <MonthPicker v-model="month1">
        <template #trigger="{ open, displayText }">
          <button class="custom-btn" @click="open">
            📅 {{ displayText || 'Pick a month' }}
          </button>
        </template>
      </MonthPicker>
    </section>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f7;
  color: #1a1a1a;
  padding: 20px;
}

.demo {
  max-width: 480px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
}

h2 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.value {
  margin-top: 8px;
  font-size: 13px;
  color: #888;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.custom-btn {
  padding: 10px 16px;
  border: 2px dashed #007aff;
  border-radius: 8px;
  background: #f0f7ff;
  color: #007aff;
  font-size: 15px;
  cursor: pointer;
}

.custom-btn:hover {
  background: #e0efff;
}

.theme-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.theme-toggle {
  padding: 8px 14px;
  border: 1px solid #c6c6c8;
  border-radius: 8px;
  background: #fff;
  color: #1a1a1a;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
}

.theme-toggle:hover {
  border-color: #007aff;
}

/* Two-class override beating the library's single-class rules — no
   !important needed now that the component styles are not scoped. */
.branded .vmp-trigger {
  border: 2px solid #7c3aed;
  border-radius: 999px;
  background: #f5f3ff;
}

.branded .vmp-trigger-text {
  color: #6d28d9;
  font-weight: 600;
}

/* Demo page follows the same opt-in dark attribute the library uses */
[data-vmp-theme='dark'] body {
  background: #000;
  color: #f2f2f7;
}

[data-vmp-theme='dark'] h2 {
  color: #98989f;
}

[data-vmp-theme='dark'] section {
  background: #1c1c1e;
  box-shadow: 0 1px 3px #0000004d;
}

[data-vmp-theme='dark'] code {
  background: #2c2c2e;
  color: #f2f2f7;
}

[data-vmp-theme='dark'] .theme-toggle {
  background: #1c1c1e;
  border-color: #3a3a3c;
  color: #f2f2f7;
}

[data-vmp-theme='dark'] .branded .vmp-trigger {
  background: #2e1065;
}

[data-vmp-theme='dark'] .branded .vmp-trigger-text {
  color: #c4b5fd;
}

[data-vmp-theme='dark'] .custom-btn {
  background: #0a1f33;
  border-color: #0a84ff;
  color: #0a84ff;
}
</style>
