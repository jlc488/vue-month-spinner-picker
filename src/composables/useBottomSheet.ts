import { ref, onUnmounted } from 'vue';
import type { UseBottomSheetOptions, UseBottomSheetReturn } from '../types';

export function useBottomSheet(options: UseBottomSheetOptions = {}): UseBottomSheetReturn {
  const { onDismiss } = options;

  const sheetRef = ref<HTMLElement | null>(null);
  const backdropRef = ref<HTMLElement | null>(null);
  const isVisible = ref(false);

  let originalOverflow = '';

  function lockScroll() {
    if (typeof document !== 'undefined') {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  function unlockScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = originalOverflow;
    }
  }

  function open() {
    isVisible.value = true;
    lockScroll();
  }

  function close() {
    isVisible.value = false;
    unlockScroll();
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (isVisible.value) {
      unlockScroll();
    }
  });

  return {
    sheetRef,
    backdropRef,
    isVisible,
    open,
    close,
  };
}
