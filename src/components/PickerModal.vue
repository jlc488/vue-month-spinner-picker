<script setup lang="ts">
import { watch, nextTick, onUnmounted } from 'vue';
import { useBottomSheet } from '../composables/useBottomSheet';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  teleportTo?: string;
}>(), {
  title: 'Select Month',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  teleportTo: 'body',
});

const emit = defineEmits<{
  'confirm': [];
  'cancel': [];
  'dismiss': [];
}>();

const { sheetRef, backdropRef, isVisible, open, close } = useBottomSheet({
  onDismiss: () => emit('dismiss'),
});

// ── Keyboard handling & focus management ────────────────────

let previouslyFocused: HTMLElement | null = null;

function getFocusableElements(): HTMLElement[] {
  if (!sheetRef.value) return [];
  return Array.from(
    sheetRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    emit('dismiss');
    return;
  }

  // Cycle focus within the sheet
  if (e.key === 'Tab') {
    const focusables = getFocusableElements();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (e.shiftKey) {
      if (active === first || !sheetRef.value?.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !sheetRef.value?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

function activateModal() {
  if (typeof document === 'undefined') return;
  previouslyFocused = document.activeElement as HTMLElement | null;
  document.addEventListener('keydown', onDocumentKeydown);
  nextTick(() => {
    getFocusableElements()[0]?.focus();
  });
}

function deactivateModal() {
  if (typeof document === 'undefined') return;
  document.removeEventListener('keydown', onDocumentKeydown);
  previouslyFocused?.focus?.();
  previouslyFocused = null;
}

// Sync with isOpen prop
watch(() => props.isOpen, (val) => {
  if (val) {
    open();
    activateModal();
  } else {
    close();
    deactivateModal();
  }
}, { immediate: true });

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onDocumentKeydown);
  }
});

function onConfirm() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
}

function onBackdropClick() {
  emit('dismiss');
}
</script>

<template>
  <Teleport :to="teleportTo">
    <Transition name="vmp-modal">
      <div v-if="isVisible" class="vmp-modal-overlay" ref="backdropRef" @click.self="onBackdropClick">
        <div class="vmp-modal-sheet" ref="sheetRef" role="dialog" aria-modal="true" :aria-label="title">
          <!-- Header -->
          <div class="vmp-modal-header">
            <button type="button" class="vmp-modal-btn vmp-modal-btn--cancel" @click="onCancel">
              {{ cancelText }}
            </button>
            <span class="vmp-modal-title">{{ title }}</span>
            <button type="button" class="vmp-modal-btn vmp-modal-btn--confirm" @click="onConfirm">
              {{ confirmText }}
            </button>
          </div>

          <!-- Content (spinner columns go here) -->
          <div class="vmp-modal-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.vmp-modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--vmp-backdrop, rgba(0, 0, 0, 0.4));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
}

.vmp-modal-sheet {
  background: var(--vmp-background, #ffffff);
  border-radius: var(--vmp-radius, 12px) var(--vmp-radius, 12px) 0 0;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
}

.vmp-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vmp-border, #c6c6c8);
}

.vmp-modal-title {
  font-size: var(--vmp-font-size-md, 16px);
  font-weight: 600;
  color: var(--vmp-text-primary, #1a1a1a);
  font-family: var(--vmp-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
}

.vmp-modal-btn {
  background: none;
  border: none;
  font-size: var(--vmp-font-size-md, 16px);
  font-family: var(--vmp-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.vmp-modal-btn--cancel {
  color: var(--vmp-text-secondary, #8e8e93);
}

.vmp-modal-btn--confirm {
  color: var(--vmp-primary, #007aff);
  font-weight: 600;
}

.vmp-modal-content {
  display: flex;
  padding: 8px 16px 24px;
  gap: 0;
}

/* Transition animations */
.vmp-modal-enter-active,
.vmp-modal-leave-active {
  transition: opacity 0.3s ease;
}

.vmp-modal-enter-active .vmp-modal-sheet,
.vmp-modal-leave-active .vmp-modal-sheet {
  transition: transform 0.3s ease;
}

.vmp-modal-enter-from,
.vmp-modal-leave-to {
  opacity: 0;
}

.vmp-modal-enter-from .vmp-modal-sheet,
.vmp-modal-leave-to .vmp-modal-sheet {
  transform: translateY(100%);
}
</style>
