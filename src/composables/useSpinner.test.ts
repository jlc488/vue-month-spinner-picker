import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useSpinner } from './useSpinner';
import type { SpinnerItem } from '../types';

function makeItems(count: number, disabledIndices: number[] = []): SpinnerItem[] {
  return Array.from({ length: count }, (_, i) => ({
    value: i + 1,
    label: `Item ${i + 1}`,
    disabled: disabledIndices.includes(i),
  }));
}

describe('useSpinner', () => {
  const itemHeight = 40;
  const visibleCount = 5;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(Date.now()), 0) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  });

  it('initializes offset to match selectedValue', () => {
    const items = ref(makeItems(12));
    const selectedValue = ref<number | string>(5);

    const { currentOffset } = useSpinner({ items, selectedValue, itemHeight, visibleCount });

    // Item index 4 (value=5) → offset = -4 * 40 = -160
    expect(currentOffset.value).toBe(-4 * itemHeight);
  });

  it('selectedIndex reflects current offset', () => {
    const items = ref(makeItems(12));
    const selectedValue = ref<number | string>(1);

    const { currentOffset, selectedIndex } = useSpinner({
      items,
      selectedValue,
      itemHeight,
      visibleCount,
    });

    // Move offset to item index 3
    currentOffset.value = -3 * itemHeight;
    expect(selectedIndex.value).toBe(3);
  });

  it('selectedIndex clamps to valid range', () => {
    const items = ref(makeItems(5));
    const selectedValue = ref<number | string>(1);

    const { currentOffset, selectedIndex } = useSpinner({
      items,
      selectedValue,
      itemHeight,
      visibleCount,
    });

    // Offset way beyond items
    currentOffset.value = -100 * itemHeight;
    expect(selectedIndex.value).toBe(4); // last item

    currentOffset.value = 100 * itemHeight;
    expect(selectedIndex.value).toBe(0); // first item
  });

  it('scrollToValue moves offset to correct position', () => {
    const items = ref(makeItems(12));
    const selectedValue = ref<number | string>(1);

    const { currentOffset, scrollToValue } = useSpinner({
      items,
      selectedValue,
      itemHeight,
      visibleCount,
    });

    scrollToValue(7);
    // value=7 is at index 6 → offset = -6 * 40 = -240
    expect(currentOffset.value).toBe(-6 * itemHeight);
  });

  it('scrollToValue does nothing for non-existent value', () => {
    const items = ref(makeItems(5));
    const selectedValue = ref<number | string>(1);

    const { currentOffset, scrollToValue } = useSpinner({
      items,
      selectedValue,
      itemHeight,
      visibleCount,
    });

    const before = currentOffset.value;
    scrollToValue(999);
    expect(currentOffset.value).toBe(before);
  });

  it('syncs offset when selectedValue changes externally', async () => {
    const items = ref(makeItems(12));
    const selectedValue = ref<number | string>(1);

    const { currentOffset } = useSpinner({ items, selectedValue, itemHeight, visibleCount });

    expect(currentOffset.value + 0).toBe(0); // index 0

    selectedValue.value = 10;
    await nextTick();

    // value=10 is at index 9 → offset = -9 * 40 = -360
    expect(currentOffset.value).toBe(-9 * itemHeight);
  });

  it('re-initializes offset when items change', async () => {
    const items = ref(makeItems(12));
    const selectedValue = ref<number | string>(3);

    const { currentOffset } = useSpinner({ items, selectedValue, itemHeight, visibleCount });

    expect(currentOffset.value).toBe(-2 * itemHeight); // index 2

    // Replace items — value 3 is now at index 2 in new list
    items.value = makeItems(6);
    await nextTick();

    expect(currentOffset.value).toBe(-2 * itemHeight);
  });

  it('returns touch and mouse event handlers', () => {
    const items = ref(makeItems(5));
    const selectedValue = ref<number | string>(1);

    const result = useSpinner({ items, selectedValue, itemHeight, visibleCount });

    expect(typeof result.onTouchStart).toBe('function');
    expect(typeof result.onTouchMove).toBe('function');
    expect(typeof result.onTouchEnd).toBe('function');
    expect(typeof result.onMouseDown).toBe('function');
    expect(typeof result.scrollToValue).toBe('function');
  });

  describe('disabled item skipping', () => {
    it('snaps to nearest enabled item when target is disabled', () => {
      // Items: 1(ok), 2(disabled), 3(ok), 4(ok), 5(ok)
      const items = ref(makeItems(5, [1])); // index 1 disabled
      const selectedValue = ref<number | string>(1);

      const { currentOffset } = useSpinner({ items, selectedValue, itemHeight, visibleCount });

      // Simulate offset pointing to disabled index 1
      currentOffset.value = -1 * itemHeight;

      // Trigger snap by calling onTouchEnd with no velocity
      // We need to simulate a touch sequence with no movement
      const spinner = useSpinner({
        items,
        selectedValue: ref<number | string>(1),
        itemHeight,
        visibleCount,
      });

      // Set offset to disabled item position
      spinner.currentOffset.value = -1 * itemHeight;

      // Simulate touch start + end (no movement = no velocity → snap)
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientY: 100 } as Touch],
      });
      spinner.onTouchStart(touchStart);

      const touchEnd = new TouchEvent('touchend');
      spinner.onTouchEnd(touchEnd);

      // Should snap to index 0 (nearest enabled) since index 1 is disabled
      expect(spinner.currentOffset.value + 0).toBe(0); // index 0
    });

    it('finds enabled item searching forward when backward items are also disabled', () => {
      // Items: 1(disabled), 2(disabled), 3(ok), 4(ok), 5(ok)
      const items = ref(makeItems(5, [0, 1]));
      const selectedValue = ref<number | string>(3);

      const spinner = useSpinner({ items, selectedValue, itemHeight, visibleCount });

      // Set offset to disabled index 0
      spinner.currentOffset.value = 0;

      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientY: 100 } as Touch],
      });
      spinner.onTouchStart(touchStart);
      spinner.onTouchEnd(new TouchEvent('touchend'));

      // Should snap to index 2 (first enabled)
      expect(spinner.currentOffset.value).toBe(-2 * itemHeight);
    });
  });
});
