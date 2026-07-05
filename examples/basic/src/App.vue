<script setup lang="ts">
import { ref } from 'vue';
import { MonthPicker, ko } from 'vue-month-spinner-picker';

const basic = ref('2026-07');
const constrained = ref('');
const korean = ref('2026-01');
</script>

<template>
  <main class="page">
    <h1>vue-month-spinner-picker</h1>
    <p class="hint">
      Drag, scroll the mouse wheel, or tap an item to select. Works with touch on mobile.
    </p>

    <section>
      <h2>Basic</h2>
      <MonthPicker v-model="basic" label="Month" />
      <code>v-model: {{ basic || '(empty)' }}</code>
    </section>

    <section>
      <h2>Min/max constraints</h2>
      <MonthPicker
        v-model="constrained"
        label="Between 2026-03 and 2027-06"
        min-month="2026-03"
        max-month="2027-06"
        :year-range="[2024, 2029]"
      />
      <code>v-model: {{ constrained || '(empty)' }}</code>
    </section>

    <section>
      <h2>Korean locale</h2>
      <MonthPicker v-model="korean" label="월 선택" :locale="ko" />
      <code>v-model: {{ korean || '(empty)' }}</code>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  background: #f2f2f7;
}

.page {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 64px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1 {
  font-size: 22px;
}

.hint {
  color: #666;
  font-size: 14px;
}

section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

h2 {
  font-size: 15px;
  margin: 0;
}

code {
  font-size: 13px;
  color: #007aff;
}
</style>
