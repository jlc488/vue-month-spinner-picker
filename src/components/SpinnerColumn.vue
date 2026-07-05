<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSpinner } from '../composables/useSpinner';
import type { SpinnerItem } from '../types';

const props = withDefaults(defineProps<{
  items: SpinnerItem[];
  modelValue: number | string;
  visibleCount?: number;
  itemHeight?: number;
}>(), {
  visibleCount: 5,
  itemHeight: 40,
});

const emit = defineEmits<{
  'update:modelValue': [value: number | string];
}>();

// Create reactive refs for useSpinner
const itemsRef = computed(() => props.items);
const selectedValue = ref<number | string>(props.modelValue);

// Sync selectedValue with modelValue prop
watch(() => props.modelValue, (val) => {
  selectedValue.value = val;
});

// Emit when selectedValue changes internally (from spinner interaction)
watch(selectedValue, (val) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val);
  }
});

const { containerRef, currentOffset, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onWheel, onItemClick } = useSpinner({
  items: itemsRef,
  selectedValue,
  itemHeight: props.itemHeight,
  visibleCount: props.visibleCount,
});

const containerHeight = computed(() => props.visibleCount * props.itemHeight);
const paddingOffset = computed(() => Math.floor(props.visibleCount / 2) * props.itemHeight);

// Keyboard navigation
function onKeyDown(e: KeyboardEvent) {
  const currentIdx = props.items.findIndex(item => item.value === selectedValue.value);
  if (e.key === 'ArrowUp' && currentIdx > 0) {
    e.preventDefault();
    for (let i = currentIdx - 1; i >= 0; i--) {
      if (!props.items[i].disabled) {
        selectedValue.value = props.items[i].value;
        break;
      }
    }
  } else if (e.key === 'ArrowDown' && currentIdx < props.items.length - 1) {
    e.preventDefault();
    for (let i = currentIdx + 1; i < props.items.length; i++) {
      if (!props.items[i].disabled) {
        selectedValue.value = props.items[i].value;
        break;
      }
    }
  }
}
</script>

<template>
  <div
    class="vmp-spinner-column"
    :style="{ height: containerHeight + 'px' }"
    tabindex="0"
    role="listbox"
    @keydown="onKeyDown"
  >
    <!-- Selection highlight -->
    <div
      class="vmp-spinner-highlight"
      :style="{
        top: paddingOffset + 'px',
        height: itemHeight + 'px',
      }"
    />

    <!-- Scrollable items -->
    <div
      ref="containerRef"
      class="vmp-spinner-items"
      :style="{
        transform: `translateY(${currentOffset + paddingOffset}px)`,
      }"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @wheel="onWheel"
    >
      <div
        v-for="(item, index) in items"
        :key="String(item.value)"
        class="vmp-spinner-item"
        :class="{
          'vmp-spinner-item--selected': item.value === selectedValue,
          'vmp-spinner-item--disabled': item.disabled,
        }"
        :style="{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }"
        role="option"
        :aria-selected="item.value === selectedValue"
        :aria-disabled="item.disabled || undefined"
        @click="onItemClick(index)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- Top fade gradient -->
    <div class="vmp-spinner-fade vmp-spinner-fade--top" :style="{ height: paddingOffset + 'px' }" />
    <!-- Bottom fade gradient -->
    <div class="vmp-spinner-fade vmp-spinner-fade--bottom" :style="{ height: paddingOffset + 'px' }" />
  </div>
</template>

<style scoped>
.vmp-spinner-column {
  position: relative;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  outline: none;
  flex: 1;
}

.vmp-spinner-highlight {
  position: absolute;
  left: 0;
  right: 0;
  background: var(--vmp-spinner-highlight-bg, rgba(0, 122, 255, 0.08));
  border-top: 1px solid var(--vmp-border, #c6c6c8);
  border-bottom: 1px solid var(--vmp-border, #c6c6c8);
  pointer-events: none;
  z-index: 1;
}

.vmp-spinner-items {
  will-change: transform;
}

.vmp-spinner-item {
  text-align: center;
  font-size: var(--vmp-font-size-md, 16px);
  font-family: var(--vmp-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  color: var(--vmp-text-primary, #1a1a1a);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
}

.vmp-spinner-item--selected {
  font-size: var(--vmp-font-size-lg, 20px);
  font-weight: 600;
}

.vmp-spinner-item--disabled {
  color: var(--vmp-text-secondary, #8e8e93);
  opacity: 0.4;
  cursor: default;
}

.vmp-spinner-fade {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 2;
}

.vmp-spinner-fade--top {
  top: 0;
  background: linear-gradient(
    to bottom,
    var(--vmp-spinner-fade-color, var(--vmp-background, #ffffff)) 0%,
    transparent 100%
  );
}

.vmp-spinner-fade--bottom {
  bottom: 0;
  background: linear-gradient(
    to top,
    var(--vmp-spinner-fade-color, var(--vmp-background, #ffffff)) 0%,
    transparent 100%
  );
}
</style>
