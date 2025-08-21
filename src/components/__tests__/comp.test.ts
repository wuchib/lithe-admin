import { mount } from '@vue/test-utils'
import { describe, it, expect} from 'vitest'
import { nextTick } from 'vue'

import { ButtonAnimation, CollapseTransition, EmptyPlaceholder } from '../index'

describe('ButtonAnimation Component', () => {
  it('render component', () => {
    const wrapper = mount(ButtonAnimation, {
      slots: {
        default: '<div>context</div>',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.grid.place-items-center').exists()).toBe(true)
  })

  it('click to trigger animation', async () => {
    const wrapper = mount(ButtonAnimation, {
      props: {
        animation: 'beat',
        duration: 100,
      },
      slots: {
        default: '<div>context</div>',
      },
    })

    expect(wrapper.find('.animate-beat').exists()).toBe(false)

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.animate-beat').exists()).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(wrapper.find('.animate-beat').exists()).toBe(false)
  })

  it('render different animation effects according to props', async () => {
    const wrapper = mount(ButtonAnimation, {
      props: {
        animation: 'shake',
        duration: 100,
      },
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.animate-shake').exists()).toBe(true)
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
  })
})

describe('EmptyPlaceholder Component', () => {
  it('render component', () => {
    const wrapper = mount(EmptyPlaceholder, {
      props: {
        show: true,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.n-empty').exists()).toBe(true)
  })
})

describe('CollapseTransition Component', () => {
  it('toggle by v-if when display=false', async () => {
    const wrapper = mount(CollapseTransition, {
      props: {
        display: true,
        direction: 'vertical',
      },
      slots: { default: '<div class="context">context</div>' },
    })

    expect(wrapper.find('.context').exists()).toBe(true)

    await wrapper.setProps({ display: false })
    await nextTick()

    expect(wrapper.find('.context').exists()).toBe(false)
  })
})
