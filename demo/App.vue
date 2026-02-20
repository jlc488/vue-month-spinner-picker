<script setup lang="ts">
import { ref } from 'vue';
import MonthPicker from '../src/components/MonthPicker.vue';
import { ko } from '../src/locales';
import { mergeLocale } from '../src/locales';

const month1 = ref('2025-06');
const month2 = ref('');
const month3 = ref('2025-03');
const month4 = ref('2025-01');

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
</style>
