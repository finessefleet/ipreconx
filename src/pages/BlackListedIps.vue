<template>
  <!-- Logo displayed at the top center of the UI -->
  <img src="@/assets/images/logo.png" class="w-50 m-auto" />

  <!-- Search and Refresh Controls -->
  <div class="flex justify-center">
    <!-- Text input for user to filter IP addresses -->
    <input
      type="text"
      v-model="searchTerm" 
      placeholder="Search IP address..."
      class="bg-white border border-gray-100 px-2 py-1 rounded"
    />

    <!-- Button to re-fetch the IP list -->
    <button
      @click="getBlackListedIps" 
      class="bg-green-700 text-white py-1 px-2 border border-green-800 mx-3 rounded"
    >
      <!-- Conditional text based on loading state -->
      <span v-if="loading">Loading</span>
      <span v-else>Refresh IP List</span>
    </button>
  </div>

  <!-- Display paginated IPs if available -->
  <div class="flex flex-wrap justify-center gap-3 my-5" v-if="paginatedIps.length">
    <div class="bg-gray-100 rounded p-2 w-[150px]" v-for="ip in paginatedIps" :key="ip" @click="getIpLocation(ip)">
      {{ ip }}
    </div>
  </div>

  <!-- Message shown when no IPs match the search input -->
  <div class="text-gray-500 text-center my-10" v-else>
    No blacklisted IP address found containing "{{ searchTerm }}"
  </div>

  <!-- Pagination controls to navigate between pages -->
  <Pagination
    :currentPage="currentPage"           
    :totalPages="totalPages"            
    @update:currentPage="currentPage = $event"
  />
</template>

<script setup>
// Import Vue’s Composition API methods
import { ref, computed, watch } from "vue";
// Import Pagination component (assumed to be reusable)
import Pagination from '@/components/Pagination.vue';
import { useRouter } from "vue-router";

const blacklistedIps = ref([]);
const searchTerm = ref("");
const currentPage = ref(1);
const loading = ref(false);
const itemsPerPage = 100;

const router = useRouter();
// Remote URL where the IP blacklist is hosted
const url = "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset";

/**
 * Fetches the blacklisted IP addresses from the given remote URL.
 * Extracts IPs using regex and updates state.
 */
async function getBlackListedIps() {
  try {
    loading.value = true; // Enable loading UI

    // Fetch the raw content from the URL
    const response = await fetch(url);
    const rawContent = await response.text();

    // Extract all IPv4 addresses using regex
    const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    blacklistedIps.value = rawContent.match(regex) || [];

    // Reset search and pagination on refresh
    searchTerm.value = '';
    currentPage.value = 1;
  } catch (error) {
    console.error("Error fetching IP list:", error);
  } finally {
    loading.value = false;
  }
}

// Automatically fetch IP list when component is first mounted
getBlackListedIps();

/**
 * Returns a filtered list of IPs that match the current search input.
 * Case-sensitive substring match is used here.
 */
const filteredIps = computed(() =>
  blacklistedIps.value.filter(ip =>
    ip.includes(searchTerm.value.trim())
  )
);

/**
 * Calculates the total number of pages based on the number of filtered IPs.
 */
const totalPages = computed(() => {
  currentPage.value = 1;
  return Math.ceil(filteredIps.value.length / itemsPerPage)
});

/**
 * Returns only the IPs that should be displayed on the current page.
 * Handles pagination slicing logic.
 */
const paginatedIps = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredIps.value.slice(start, end)
})

const getIpLocation = (ipaddress) => {
  // https://www.virustotal.com/api/v3/ip_addresses/{ip}
  fetch(`https://api.iplocation.net/?ip=${ipaddress}`).then(async res => {
    const {country_name, isp} = await res.json();
    alert(country_name + ' : ' + isp);
  });
  router.push({name: 'ip', params: { ip: ipaddress}})
}
</script>
