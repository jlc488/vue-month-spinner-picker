import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { useBottomSheet } from './useBottomSheet';
import type { UseBottomSheetReturn } from '../types';

/**
 * Helper: run a composable inside a real Vue component instance
 * so lifecycle hooks (onUnmounted) work correctly.
 */
function withSetup(setup: () => UseBottomSheetReturn) {
  let result!: UseBottomSheetReturn;
  const comp = defineComponent({
    setup() {
      result = setup();
      return () => h('div');
    },
  });
  const root = document.createElement('div');
  const app = createApp(comp);
  app.mount(root);
  return { result, app };
}

describe('useBottomSheet', () => {
  let savedOverflow: string;

  beforeEach(() => {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = savedOverflow;
  });

  it('initializes with isVisible false', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    expect(result.isVisible.value).toBe(false);
    app.unmount();
  });

  it('initializes refs as null', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    expect(result.sheetRef.value).toBeNull();
    expect(result.backdropRef.value).toBeNull();
    app.unmount();
  });

  it('sets isVisible to true on open', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    result.open();
    expect(result.isVisible.value).toBe(true);
    app.unmount();
  });

  it('locks body scroll on open', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    document.body.style.overflow = 'auto';
    result.open();
    expect(document.body.style.overflow).toBe('hidden');
    result.close();
    app.unmount();
  });

  it('sets isVisible to false on close', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    result.open();
    result.close();
    expect(result.isVisible.value).toBe(false);
    app.unmount();
  });

  it('restores body scroll on close', () => {
    const { result, app } = withSetup(() => useBottomSheet());
    document.body.style.overflow = 'auto';
    result.open();
    expect(document.body.style.overflow).toBe('hidden');
    result.close();
    expect(document.body.style.overflow).toBe('auto');
    app.unmount();
  });

  it('restores body scroll on unmount when visible', () => {
    document.body.style.overflow = 'auto';
    const { result, app } = withSetup(() => useBottomSheet());
    result.open();
    expect(document.body.style.overflow).toBe('hidden');
    app.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not change body scroll on unmount when not visible', () => {
    document.body.style.overflow = 'auto';
    const { app } = withSetup(() => useBottomSheet());
    app.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('accepts onDismiss callback option without error', () => {
    const onDismiss = vi.fn();
    const { result, app } = withSetup(() => useBottomSheet({ onDismiss }));
    expect(result.isVisible.value).toBe(false);
    app.unmount();
  });
});
