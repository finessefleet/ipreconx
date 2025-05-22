<template>
  <h1>IPRECONX</h1>

  <!-- 🔍 Search box -->
  <input
    type="text"
    v-model="searchTerm"
    placeholder="Search IP address..."
    class="search-box"
  />

  <!-- 🔁 Refresh button -->
  <button @click="getBlackListedIps" class="refresh-button">
    Refresh IP List
  </button>

  <!-- 📄 IP Address List -->
  <div class="container">
    <div class="ipaddress" v-for="ip in paginatedIps" :key="ip">
      {{ ip }}
    </div>
  </div>

  <!-- 📌 Pagination Controls -->
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>

    <span>Page {{ currentPage }} of {{ totalPages }}</span>

    <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const blacklistedIps = ref([])
const searchTerm = ref("")
const currentPage = ref(1)
const itemsPerPage = 100

const url =
  "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset"

async function getBlackListedIps() {
  try {
    const response = await fetch(url)
    const rawContent = await response.text()
    const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
    blacklistedIps.value = rawContent.match(regex) || []
    currentPage.value = 1 // reset to page 1 on refresh
  } catch (error) {
    console.error("Error fetching IP list:", error)
  }
}

// Initial fetch
getBlackListedIps()

// Filter by search
const filteredIps = computed(() =>
  blacklistedIps.value.filter(ip =>
    ip.includes(searchTerm.value.trim())
  )
)

// Total pages based on filtered result
const totalPages = computed(() =>
  Math.ceil(filteredIps.value.length / itemsPerPage)
)

// Slice for current page
const paginatedIps = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredIps.value.slice(start, end)
})
</script>

<style>
.container {
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.ipaddress {
  background-color: #f1f1f1;
  padding: 7px 15px;
  border-radius: 5px;
  font-family: 'Courier New', Courier, monospace;
  color: #333;
}

.search-box {
  margin: 10px 10px 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.refresh-button {
  padding: 8px 12px;
  font-size: 16px;
  margin-bottom: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #45a049;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.pagination button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 16px;
}
</style>
