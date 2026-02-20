import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PickerModal from './PickerModal.vue';

// Mount helper that attaches to a real DOM element so Teleport works
function mountModal(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const teleportTarget = document.createElement('div');
  teleportTarget.id = 'modal-target';
  document.body.appendChild(teleportTarget);

  const wrapper = mount(PickerModal, {
    props: { isOpen: false, ...props },
    slots,
    global: {
      stubs: {
        Teleport: true,
      },
    },
  });

  return { wrapper, teleportTarget };
}

function cleanup(teleportTarget: HTMLElement) {
  teleportTarget.remove();
}

describe('PickerModal', () => {
  it('does not render content when isOpen is false', () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: false });
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(false);
    cleanup(teleportTarget);
  });

  it('renders content when isOpen is true', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    // useBottomSheet.open() is called synchronously via watch immediate
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(true);
    expect(wrapper.find('.vmp-modal-sheet').exists()).toBe(true);
    cleanup(teleportTarget);
  });

  it('renders default title, confirm, and cancel text', () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    expect(wrapper.find('.vmp-modal-title').text()).toBe('Select Month');
    expect(wrapper.find('.vmp-modal-btn--confirm').text()).toBe('Confirm');
    expect(wrapper.find('.vmp-modal-btn--cancel').text()).toBe('Cancel');
    cleanup(teleportTarget);
  });

  it('renders custom title, confirm, and cancel text', () => {
    const { wrapper, teleportTarget } = mountModal({
      isOpen: true,
      title: '월 선택',
      confirmText: '확인',
      cancelText: '취소',
    });
    expect(wrapper.find('.vmp-modal-title').text()).toBe('월 선택');
    expect(wrapper.find('.vmp-modal-btn--confirm').text()).toBe('확인');
    expect(wrapper.find('.vmp-modal-btn--cancel').text()).toBe('취소');
    cleanup(teleportTarget);
  });

  it('emits confirm when confirm button is clicked', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    await wrapper.find('.vmp-modal-btn--confirm').trigger('click');
    expect(wrapper.emitted('confirm')).toHaveLength(1);
    cleanup(teleportTarget);
  });

  it('emits cancel when cancel button is clicked', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    await wrapper.find('.vmp-modal-btn--cancel').trigger('click');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    cleanup(teleportTarget);
  });

  it('emits dismiss when backdrop is clicked', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    await wrapper.find('.vmp-modal-overlay').trigger('click');
    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    cleanup(teleportTarget);
  });

  it('does not emit dismiss when sheet (not backdrop) is clicked', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    await wrapper.find('.vmp-modal-sheet').trigger('click');
    expect(wrapper.emitted('dismiss')).toBeUndefined();
    cleanup(teleportTarget);
  });

  it('renders slot content', () => {
    const { wrapper, teleportTarget } = mountModal(
      { isOpen: true },
      { default: '<div class="test-slot">Spinner here</div>' },
    );
    expect(wrapper.find('.test-slot').exists()).toBe(true);
    expect(wrapper.find('.test-slot').text()).toBe('Spinner here');
    cleanup(teleportTarget);
  });

  it('has correct ARIA attributes on dialog', () => {
    const { wrapper, teleportTarget } = mountModal({
      isOpen: true,
      title: 'Pick Month',
    });
    const sheet = wrapper.find('.vmp-modal-sheet');
    expect(sheet.attributes('role')).toBe('dialog');
    expect(sheet.attributes('aria-modal')).toBe('true');
    expect(sheet.attributes('aria-label')).toBe('Pick Month');
    cleanup(teleportTarget);
  });

  it('hides content when isOpen changes from true to false', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(true);

    await wrapper.setProps({ isOpen: false });
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(false);
    cleanup(teleportTarget);
  });

  it('shows content when isOpen changes from false to true', async () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: false });
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(false);

    await wrapper.setProps({ isOpen: true });
    expect(wrapper.find('.vmp-modal-overlay').exists()).toBe(true);
    cleanup(teleportTarget);
  });

  it('renders header with three elements in correct order', () => {
    const { wrapper, teleportTarget } = mountModal({ isOpen: true });
    const header = wrapper.find('.vmp-modal-header');
    const children = header.element.children;
    expect(children).toHaveLength(3);
    expect(children[0].classList.contains('vmp-modal-btn--cancel')).toBe(true);
    expect(children[1].classList.contains('vmp-modal-title')).toBe(true);
    expect(children[2].classList.contains('vmp-modal-btn--confirm')).toBe(true);
    cleanup(teleportTarget);
  });
});
