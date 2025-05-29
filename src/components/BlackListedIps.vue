<template>
  <img src="@/assets/images/logo.png" class="w-50 m-auto"/>
  
  <div class="flex justify-center">
    <input
    type="text"
    v-model="searchTerm"
    placeholder="Search IP address..."
    class="bg-white border border-gray-100 px-2 py-1 rounded" />

    <button @click="getBlackListedIps" class="bg-green-700 text-white py-1 px-2 border border-green-800 mx-3 rounded">
      <span v-if="loading">Loading</span>
      <span v-else>Refresh IP List</span>
    </button>
  </div>


  <div class="flex flex-wrap justify-center gap-3 my-5" v-if="paginatedIps.length">
    <div class="bg-gray-100 rounded p-2 w-[150px]" v-for="ip in paginatedIps" :key="ip">
      {{ ip }}
    </div>
  </div>
  <div class="text-gray-100 text-center my-50" v-else >
    No blacklisted IP address found containing {{ searchTerm }}
  </div>

  <Pagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @update:currentPage="currentPage = $event"/>
    
</template>

<script setup>
import { ref, computed } from "vue";
import Pagination from '@/components/Pagination.vue'

const blacklistedIps = ref([])
const searchTerm = ref("")
const currentPage = ref(1)
const loading = ref(false)
const itemsPerPage = 100

const url = "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset"

// Fetch IPs
async function getBlackListedIps() {
  try {
    loading.value = true;
    const response = await fetch(url)
    const rawContent = await response.text()
    const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
    blacklistedIps.value = rawContent.match(regex) || []
    searchTerm.value = '';
    currentPage.value = 1
  } catch (error) {
    console.error("Error fetching IP list:", error)
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}

// Initial load
getBlackListedIps()

// Filtered IPs by search
const filteredIps = computed(() =>
  blacklistedIps.value.filter(ip =>
    ip.includes(searchTerm.value.trim())
  )
)

// Total pages
const totalPages = computed(() => {
  currentPage.value = 1;
  return Math.ceil(filteredIps.value.length / itemsPerPage);
})

// Paginated slice of IPs
const paginatedIps = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredIps.value.slice(start, end)
})
</script>
