// tests/unit/BlacklistIpPage.spec.js
import { mount, flushPromises } from '@vue/test-utils';
import BlacklistIpPage from '../../src/pages/BlackListedIps.vue'; // adjust path as needed

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('192.168.1.1\n10.0.0.1\n172.16.0.1'),
  })
);

describe('BlacklistIpPage.vue', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches IPs on mount and renders them', async () => {
    const wrapper = mount(BlacklistIpPage);
    await flushPromises();

    // Expect fetch to have been called
    expect(fetch).toHaveBeenCalled();

    // Check if IPs are rendered
    expect(wrapper.text()).toContain('192.168.1.1');
    expect(wrapper.text()).toContain('10.0.0.1');
    expect(wrapper.text()).toContain('172.16.0.1');
  });

  it('filters IPs based on search input', async () => {
    const wrapper = mount(BlacklistIpPage);
    await flushPromises();

    // Set the searchTerm to filter results
    await wrapper.find('input').setValue('10.0.0');
    expect(wrapper.text()).toContain('10.0.0.1');
    expect(wrapper.text()).not.toContain('192.168.1.1');
  });

  it('shows loading text while fetching', async () => {
    // Delay fetch resolution
    fetch.mockImplementationOnce(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          text: () => Promise.resolve('8.8.8.8'),
        }), 100)
      )
    );

    const wrapper = mount(BlacklistIpPage);
    expect(wrapper.text()).toContain('Loading');
    await flushPromises();
  });

  it('displays "No blacklisted IP..." when no results found', async () => {
    const wrapper = mount(BlacklistIpPage);
    await flushPromises();

    await wrapper.find('input').setValue('not-an-ip');
    expect(wrapper.text()).toContain('No blacklisted IP address found containing "not-an-ip"');
  });
});
