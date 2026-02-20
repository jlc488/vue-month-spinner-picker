import { ref, computed, watch, onUnmounted, type Ref } from 'vue';
import type { SpinnerItem, UseSpinnerOptions, UseSpinnerReturn } from '../types';

export function useSpinner(options: UseSpinnerOptions): UseSpinnerReturn {
  const { items, selectedValue, itemHeight, visibleCount } = options;

  const containerRef = ref<HTMLElement | null>(null);
  const currentOffset = ref(0);

  // Drag state (non-reactive for performance)
  let isDragging = false;
  let startY = 0;
  let startOffset = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocity = 0;
  let animationId: number | null = null;

  // Selected index derived from current offset
  const selectedIndex = computed(() => {
    const idx = Math.round(-currentOffset.value / itemHeight);
    return Math.max(0, Math.min(idx, items.value.length - 1));
  });

  /**
   * Find the nearest enabled item index, searching outward from target.
   */
  function findNearestEnabledIndex(targetIdx: number): number {
    if (items.value.length === 0) return 0;
    const clamped = Math.max(0, Math.min(targetIdx, items.value.length - 1));
    if (!items.value[clamped].disabled) return clamped;

    for (let d = 1; d < items.value.length; d++) {
      if (clamped - d >= 0 && !items.value[clamped - d].disabled) return clamped - d;
      if (clamped + d < items.value.length && !items.value[clamped + d].disabled) return clamped + d;
    }
    return clamped; // fallback if all disabled
  }

  /**
   * Snap offset to the nearest enabled item and emit value change.
   */
  function snapToNearest() {
    const rawIdx = Math.round(-currentOffset.value / itemHeight);
    const idx = findNearestEnabledIndex(rawIdx);
    currentOffset.value = -idx * itemHeight;

    const item = items.value[idx];
    if (item && item.value !== selectedValue.value) {
      selectedValue.value = item.value;
    }
  }

  /**
   * Programmatically scroll to a specific value without animation.
   */
  function scrollToValue(value: number | string) {
    const idx = items.value.findIndex((item) => item.value === value);
    if (idx >= 0) {
      cancelAnimation();
      currentOffset.value = -idx * itemHeight;
    }
  }

  /**
   * Cancel any running inertia animation.
   */
  function cancelAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  /**
   * Clamp offset within valid bounds.
   */
  function clampOffset(offset: number): number {
    const maxOffset = 0;
    const minOffset = -(items.value.length - 1) * itemHeight;
    return Math.max(minOffset, Math.min(maxOffset, offset));
  }

  /**
   * Start inertia scroll animation after drag ends.
   * Uses friction-based deceleration and snaps when velocity is low enough.
   */
  function startInertia() {
    const friction = 0.95;
    const minVelocity = 0.5;

    function animate() {
      velocity *= friction;

      if (Math.abs(velocity) < minVelocity) {
        snapToNearest();
        return;
      }

      currentOffset.value += velocity;

      // Clamp and stop at boundaries
      const clamped = clampOffset(currentOffset.value);
      if (clamped !== currentOffset.value) {
        currentOffset.value = clamped;
        snapToNearest();
        return;
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
  }

  // ── Touch handlers ──────────────────────────────────────────

  function onTouchStart(e: TouchEvent) {
    cancelAnimation();
    isDragging = true;
    startY = e.touches[0].clientY;
    startOffset = currentOffset.value;
    lastY = startY;
    lastTime = Date.now();
    velocity = 0;
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    e.preventDefault();

    const y = e.touches[0].clientY;
    const now = Date.now();
    const dt = now - lastTime;

    if (dt > 0) {
      velocity = ((y - lastY) / dt) * 16; // normalize to ~60fps frame
    }

    lastY = y;
    lastTime = now;
    currentOffset.value = startOffset + (y - startY);
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(velocity) > 1) {
      startInertia();
    } else {
      snapToNearest();
    }
  }

  // ── Mouse handlers ──────────────────────────────────────────

  function onMouseDown(e: MouseEvent) {
    cancelAnimation();
    isDragging = true;
    startY = e.clientY;
    startOffset = currentOffset.value;
    lastY = startY;
    lastTime = Date.now();
    velocity = 0;

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging) return;
      ev.preventDefault();

      const y = ev.clientY;
      const now = Date.now();
      const dt = now - lastTime;

      if (dt > 0) {
        velocity = ((y - lastY) / dt) * 16;
      }

      lastY = y;
      lastTime = now;
      currentOffset.value = startOffset + (y - startY);
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (Math.abs(velocity) > 1) {
        startInertia();
      } else {
        snapToNearest();
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // ── Watchers ────────────────────────────────────────────────

  // Sync spinner position when external value changes
  watch(selectedValue, (newVal) => {
    scrollToValue(newVal);
  });

  // Initialize position when items change
  watch(
    items,
    () => {
      scrollToValue(selectedValue.value);
    },
    { immediate: true },
  );

  // Cleanup animation on unmount
  onUnmounted(() => {
    cancelAnimation();
  });

  return {
    containerRef,
    currentOffset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    scrollToValue,
    selectedIndex,
  };
}
