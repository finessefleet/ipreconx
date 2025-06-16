import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BlackListedIps from '/src/components/BlackListedIps.vue'


// Mock fetch
global.fetch = vi.fn()

const mockIps = `
1.1.1.1
2.2.2.2
3.3.3.3
4.4.4.4
5.5.5.5
`

describe('BlackListedIps.vue', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  it('fetches and displays blacklisted IPs', async () => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve(mockIps),
    })

    const wrapper = mount(BlackListedIps)

    // Wait for async operations to finish
    await flushPromises()

    // Check IPs are rendered
    expect(wrapper.text()).toContain('1.1.1.1')
    expect(wrapper.text()).toContain('5.5.5.5')

    // Should render 5 IPs
    const ipElements = wrapper.findAll('div.bg-gray-100')
    expect(ipElements.length).toBe(5)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('filters IPs based on search term', async () => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve(mockIps),
    })

    const wrapper = mount(BlackListedIps)
    await flushPromises()

    // Set search term
    await wrapper.find('input').setValue('2.2')

    // Only 2.2.2.2 should match
    expect(wrapper.text()).toContain('2.2.2.2')
    expect(wrapper.text()).not.toContain('1.1.1.1')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('shows message when no IPs match', async () => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve(mockIps),
    })

    const wrapper = mount(BlackListedIps)
    await flushPromises()

    await wrapper.find('input').setValue('9.9.9.9')

    expect(wrapper.text()).toContain('No blacklisted IP address found containing 9.9.9.9')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('resets loading state after fetch', async () => {
    vi.useFakeTimers()
    fetch.mockResolvedValue({
      text: () => Promise.resolve(mockIps),
    })

    const wrapper = mount(BlackListedIps)
    await flushPromises()

    // Simulate clicking the refresh button
    await wrapper.find('button').trigger('click')

    // Fast forward timers
    vi.runAllTimers()

    // loading should be false
    expect(wrapper.text()).not.toContain('Loading')

    vi.useRealTimers()
  })
})
