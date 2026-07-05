import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MonthPicker from './MonthPicker.vue';

describe('MonthPicker', () => {
  it('renders default trigger button with placeholder', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '' },
    });

    const trigger = wrapper.find('.vmp-trigger');
    expect(trigger.exists()).toBe(true);
    expect(wrapper.find('.vmp-trigger-placeholder').text()).toBe('Select month');
  });

  it('renders custom placeholder', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', placeholder: '월을 선택하세요' },
    });

    expect(wrapper.find('.vmp-trigger-placeholder').text()).toBe('월을 선택하세요');
  });

  it('renders display text when modelValue is valid', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '2024-03' },
    });

    expect(wrapper.find('.vmp-trigger-text').text()).toBe('2024 March');
    expect(wrapper.find('.vmp-trigger-placeholder').exists()).toBe(false);
  });

  it('renders placeholder for invalid modelValue', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: 'invalid' },
    });

    expect(wrapper.find('.vmp-trigger-placeholder').exists()).toBe(true);
    expect(wrapper.find('.vmp-trigger-text').exists()).toBe(false);
  });

  it('renders label when provided', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', label: 'Select Period' },
    });

    const label = wrapper.find('.vmp-label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Select Period');
  });

  it('does not render label when not provided', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '' },
    });

    expect(wrapper.find('.vmp-label').exists()).toBe(false);
  });

  it('renders required indicator when required is true', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', label: 'Month', required: true },
    });

    expect(wrapper.find('.vmp-required').exists()).toBe(true);
    expect(wrapper.find('.vmp-required').text()).toBe('*');
  });

  it('does not render required indicator when required is false', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', label: 'Month', required: false },
    });

    expect(wrapper.find('.vmp-required').exists()).toBe(false);
  });

  it('renders error message when errorMessage is provided', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', errorMessage: 'Required field' },
    });

    const error = wrapper.find('.vmp-error');
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe('Required field');
    expect(error.attributes('role')).toBe('alert');
  });

  it('does not render error message when errorMessage is not provided', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '' },
    });

    expect(wrapper.find('.vmp-error').exists()).toBe(false);
  });

  it('applies error class when errorMessage is provided', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', errorMessage: 'Error' },
    });

    expect(wrapper.find('.vmp-month-picker--error').exists()).toBe(true);
  });

  it('applies disabled class when disabled is true', () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', disabled: true },
    });

    expect(wrapper.find('.vmp-month-picker--disabled').exists()).toBe(true);
    expect(wrapper.find('.vmp-trigger').attributes('disabled')).toBeDefined();
  });

  it('does not open picker when disabled', async () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '', disabled: true },
    });

    await wrapper.find('.vmp-trigger').trigger('click');
    expect(wrapper.emitted('open')).toBeUndefined();
  });

  it('emits open event when trigger is clicked', async () => {
    const wrapper = mount(MonthPicker, {
      props: { modelValue: '' },
    });

    await wrapper.find('.vmp-trigger').trigger('click');
    expect(wrapper.emitted('open')).toHaveLength(1);
  });

  describe('ARIA attributes', () => {
    it('sets aria-label from label prop', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', label: 'Month' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-label')).toBe('Month');
    });

    it('falls back to placeholder for aria-label when no label', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', placeholder: 'Pick month' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-label')).toBe('Pick month');
    });

    it('sets aria-expanded to false when closed', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-expanded')).toBe('false');
    });

    it('sets aria-expanded to true when open', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      await wrapper.find('.vmp-trigger').trigger('click');
      expect(wrapper.find('.vmp-trigger').attributes('aria-expanded')).toBe('true');
    });

    it('sets aria-required when required is true', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', required: true },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-required')).toBe('true');
    });

    it('does not set aria-required when required is false', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', required: false },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-required')).toBeUndefined();
    });

    it('sets aria-invalid when errorMessage is provided', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', errorMessage: 'Error' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-invalid')).toBe('true');
    });

    it('does not set aria-invalid when no errorMessage', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-invalid')).toBeUndefined();
    });

    it('sets aria-describedby linking to error element', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', errorMessage: 'Error', id: 'test-picker' },
      });

      const trigger = wrapper.find('.vmp-trigger');
      const error = wrapper.find('.vmp-error');
      expect(trigger.attributes('aria-describedby')).toBe('test-picker-error');
      expect(error.attributes('id')).toBe('test-picker-error');
    });

    it('does not set aria-describedby when no errorMessage', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('aria-describedby')).toBeUndefined();
    });
  });

  describe('trigger slot', () => {
    it('renders custom trigger via slot', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '2024-06' },
        slots: {
          trigger: `<template #trigger="{ open, displayText }">
            <div class="custom-trigger" @click="open">{{ displayText }}</div>
          </template>`,
        },
      });

      expect(wrapper.find('.custom-trigger').exists()).toBe(true);
      expect(wrapper.find('.custom-trigger').text()).toBe('2024 June');
      expect(wrapper.find('.vmp-trigger').exists()).toBe(false);
    });
  });

  describe('exposed methods', () => {
    it('exposes openPicker method', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      expect(typeof wrapper.vm.openPicker).toBe('function');
      wrapper.vm.openPicker();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('open')).toHaveLength(1);
    });

    it('exposes closePicker method', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '' },
      });

      wrapper.vm.openPicker();
      await wrapper.vm.$nextTick();
      wrapper.vm.closePicker();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('openPicker does nothing when disabled', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', disabled: true },
      });

      wrapper.vm.openPicker();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('open')).toBeUndefined();
    });
  });

  describe('locale', () => {
    it('uses English locale by default', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '2024-01' },
      });

      expect(wrapper.find('.vmp-trigger-text').text()).toBe('2024 January');
    });

    it('applies Korean locale with yearSuffix', () => {
      const wrapper = mount(MonthPicker, {
        props: {
          modelValue: '2024-03',
          locale: {
            months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            confirmText: '확인',
            cancelText: '취소',
            title: '월 선택',
            yearSuffix: '년',
          },
        },
      });

      expect(wrapper.find('.vmp-trigger-text').text()).toBe('2024년 3월');
    });
  });

  describe('min/max range clamping', () => {
    it('clamps to minMonth when confirming right after opening with out-of-range modelValue', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '2024-05', minMonth: '2025-03' },
      });

      await wrapper.find('.vmp-trigger').trigger('click');
      await wrapper.vm.$nextTick();

      const confirmButtons = document.querySelectorAll('.vmp-modal-btn--confirm');
      (confirmButtons[confirmButtons.length - 1] as HTMLElement).click();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2025-03']);
      wrapper.unmount();
    });

    it('clamps to maxMonth when confirming right after opening with out-of-range modelValue', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '2026-12', maxMonth: '2025-06' },
      });

      await wrapper.find('.vmp-trigger').trigger('click');
      await wrapper.vm.$nextTick();

      const confirmButtons = document.querySelectorAll('.vmp-modal-btn--confirm');
      (confirmButtons[confirmButtons.length - 1] as HTMLElement).click();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2025-06']);
      wrapper.unmount();
    });

    it('clamps to minMonth when opening with empty modelValue and future minMonth', async () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', minMonth: '2999-01', yearRange: [2990, 2999] },
      });

      await wrapper.find('.vmp-trigger').trigger('click');
      await wrapper.vm.$nextTick();

      const confirmButtons = document.querySelectorAll('.vmp-modal-btn--confirm');
      (confirmButtons[confirmButtons.length - 1] as HTMLElement).click();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2999-01']);
      wrapper.unmount();
    });

    it('disables year items that have no selectable month', async () => {
      const wrapper = mount(MonthPicker, {
        props: {
          modelValue: '2025-06',
          minMonth: '2025-03',
          maxMonth: '2026-10',
          yearRange: [2023, 2028],
        },
      });

      await wrapper.find('.vmp-trigger').trigger('click');
      await wrapper.vm.$nextTick();

      const columns = document.querySelectorAll('.vmp-spinner-column');
      const yearColumn = columns[columns.length - 2]; // [year, month] of the last-opened modal
      const disabledYears = yearColumn.querySelectorAll('.vmp-spinner-item--disabled');
      // 2023, 2024 (before minMonth year), 2027, 2028 (after maxMonth year)
      expect(disabledYears).toHaveLength(4);
      wrapper.unmount();
    });
  });

  describe('custom id', () => {
    it('uses provided id for trigger button', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', id: 'my-picker' },
      });

      expect(wrapper.find('.vmp-trigger').attributes('id')).toBe('my-picker');
    });

    it('uses provided id for label for attribute', () => {
      const wrapper = mount(MonthPicker, {
        props: { modelValue: '', id: 'my-picker', label: 'Month' },
      });

      expect(wrapper.find('.vmp-label').attributes('for')).toBe('my-picker');
    });
  });
});
