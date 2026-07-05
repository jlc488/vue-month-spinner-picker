import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SpinnerColumn from './SpinnerColumn.vue';
import type { SpinnerItem } from '../types';

function createItems(count: number, disabledIndices: number[] = []): SpinnerItem[] {
  return Array.from({ length: count }, (_, i) => ({
    value: i + 1,
    label: `Item ${i + 1}`,
    disabled: disabledIndices.includes(i),
  }));
}

describe('SpinnerColumn', () => {
  it('renders all items', () => {
    const items = createItems(5);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 1 },
    });

    const rendered = wrapper.findAll('.vmp-spinner-item');
    expect(rendered).toHaveLength(5);
    expect(rendered[0].text()).toBe('Item 1');
    expect(rendered[4].text()).toBe('Item 5');
  });

  it('marks selected item with --selected class', () => {
    const items = createItems(3);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 2 },
    });

    const selected = wrapper.findAll('.vmp-spinner-item--selected');
    expect(selected).toHaveLength(1);
    expect(selected[0].text()).toBe('Item 2');
  });

  it('marks disabled items with --disabled class', () => {
    const items = createItems(4, [1, 3]);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 1 },
    });

    const disabled = wrapper.findAll('.vmp-spinner-item--disabled');
    expect(disabled).toHaveLength(2);
    expect(disabled[0].text()).toBe('Item 2');
    expect(disabled[1].text()).toBe('Item 4');
  });

  it('sets correct container height based on visibleCount and itemHeight', () => {
    const items = createItems(10);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 1, visibleCount: 5, itemHeight: 40 },
    });

    const column = wrapper.find('.vmp-spinner-column');
    expect(column.attributes('style')).toContain('height: 200px');
  });

  it('sets correct item height', () => {
    const items = createItems(3);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 1, itemHeight: 50 },
    });

    const item = wrapper.find('.vmp-spinner-item');
    expect(item.attributes('style')).toContain('height: 50px');
    expect(item.attributes('style')).toContain('line-height: 50px');
  });

  it('renders selection highlight at correct position', () => {
    const wrapper = mount(SpinnerColumn, {
      props: { items: createItems(5), modelValue: 1, visibleCount: 5, itemHeight: 40 },
    });

    const highlight = wrapper.find('.vmp-spinner-highlight');
    // paddingOffset = floor(5/2) * 40 = 80
    expect(highlight.attributes('style')).toContain('top: 80px');
    expect(highlight.attributes('style')).toContain('height: 40px');
  });

  it('renders top and bottom fade gradients', () => {
    const wrapper = mount(SpinnerColumn, {
      props: { items: createItems(5), modelValue: 1, visibleCount: 5, itemHeight: 40 },
    });

    const fades = wrapper.findAll('.vmp-spinner-fade');
    expect(fades).toHaveLength(2);
    expect(fades[0].classes()).toContain('vmp-spinner-fade--top');
    expect(fades[1].classes()).toContain('vmp-spinner-fade--bottom');
    // paddingOffset = 80
    expect(fades[0].attributes('style')).toContain('height: 80px');
    expect(fades[1].attributes('style')).toContain('height: 80px');
  });

  it('has role="listbox" and tabindex for keyboard access', () => {
    const wrapper = mount(SpinnerColumn, {
      props: { items: createItems(3), modelValue: 1 },
    });

    const column = wrapper.find('.vmp-spinner-column');
    expect(column.attributes('role')).toBe('listbox');
    expect(column.attributes('tabindex')).toBe('0');
  });

  it('sets aria-selected on items', () => {
    const items = createItems(3);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 2 },
    });

    const options = wrapper.findAll('[role="option"]');
    expect(options[0].attributes('aria-selected')).toBe('false');
    expect(options[1].attributes('aria-selected')).toBe('true');
    expect(options[2].attributes('aria-selected')).toBe('false');
  });

  it('sets aria-disabled on disabled items', () => {
    const items = createItems(3, [1]);
    const wrapper = mount(SpinnerColumn, {
      props: { items, modelValue: 1 },
    });

    const options = wrapper.findAll('[role="option"]');
    expect(options[0].attributes('aria-disabled')).toBeUndefined();
    expect(options[1].attributes('aria-disabled')).toBe('true');
    expect(options[2].attributes('aria-disabled')).toBeUndefined();
  });

  describe('keyboard navigation', () => {
    it('emits update:modelValue on ArrowDown', async () => {
      const items = createItems(5);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    });

    it('emits update:modelValue on ArrowUp', async () => {
      const items = createItems(5);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 3 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowUp' });
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    });

    it('skips disabled items on ArrowDown', async () => {
      const items = createItems(5, [1]); // Item 2 (index 1) disabled
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
    });

    it('skips disabled items on ArrowUp', async () => {
      const items = createItems(5, [1]); // Item 2 (index 1) disabled
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 3 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowUp' });
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
    });

    it('does not emit when at first item and ArrowUp', async () => {
      const items = createItems(3);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowUp' });
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit when at last item and ArrowDown', async () => {
      const items = createItems(3);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 3 },
      });

      await wrapper.find('.vmp-spinner-column').trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  it('uses default visibleCount of 5 and itemHeight of 40', () => {
    const wrapper = mount(SpinnerColumn, {
      props: { items: createItems(10), modelValue: 1 },
    });

    const column = wrapper.find('.vmp-spinner-column');
    expect(column.attributes('style')).toContain('height: 200px');
  });

  describe('tap to select', () => {
    it('selects an item on click', async () => {
      const items = createItems(5);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1 },
      });

      await wrapper.findAll('.vmp-spinner-item')[3].trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4]);
    });

    it('ignores clicks on disabled items', async () => {
      const items = createItems(5, [2]);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1 },
      });

      await wrapper.findAll('.vmp-spinner-item')[2].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('ignores the click fired at the end of a drag', async () => {
      // Fake Date so drag velocity stays below the inertia threshold and the
      // snap emit happens synchronously on mouseup (no async rAF animation)
      vi.useFakeTimers();
      const items = createItems(5);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1, itemHeight: 40 },
      });

      const container = wrapper.find('.vmp-spinner-items');
      // Simulate a slow 40px drag: mousedown, mousemove after 1s, mouseup
      await container.trigger('mousedown', { clientY: 100 });
      vi.advanceTimersByTime(1000);
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: 60 }));
      document.dispatchEvent(new MouseEvent('mouseup'));
      await wrapper.vm.$nextTick();

      // The drag itself snapped to item 2
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);
      const emittedBefore = wrapper.emitted('update:modelValue')!.length;

      // The trailing click after a drag must not add another selection
      await wrapper.findAll('.vmp-spinner-item')[4].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toHaveLength(emittedBefore);
      vi.useRealTimers();
    });
  });

  describe('wheel scrolling', () => {
    it('scrolls and snaps to the next item on wheel down', async () => {
      vi.useFakeTimers();
      const items = createItems(5);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 1, itemHeight: 40 },
      });

      await wrapper.find('.vmp-spinner-items').trigger('wheel', { deltaY: 40 });
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
      vi.useRealTimers();
    });

    it('does not scroll past the last item', async () => {
      vi.useFakeTimers();
      const items = createItems(3);
      const wrapper = mount(SpinnerColumn, {
        props: { items, modelValue: 3, itemHeight: 40 },
      });

      await wrapper.find('.vmp-spinner-items').trigger('wheel', { deltaY: 500 });
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();

      // Already at last item — no change emitted
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      vi.useRealTimers();
    });
  });
});
