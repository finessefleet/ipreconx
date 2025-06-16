<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col md:flex-row gap-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div class="flex flex-col items-center justify-center bg-gray-700 w-32 h-32">
        <div class="text-3xl font-bold text-green-400">0</div>
        <div class="text-sm text-gray-300">/ 94</div>
        <div class="text-xs mt-1 text-gray-400">Community Score</div>
      </div>

      <div class="flex-1">
        <p class="text-sm text-gray-400 mb-2">
          3 detected files communicating with this IP address
        </p>
        <h2 class="text-xl font-semibold">
          {{ ip }} 
          <span class="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded ml-2">
            private
          </span>
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Last Analysis Date: 
          <span class="text-blue-400 font-medium animate-fade-in-up duration-700 delay-200 inline-block">
            {{ getFormatteddate(data.attributes.last_analysis_date) }}
          </span>
        </p>
      </div>

      <div>
        <div class="text-sm text-gray-500 mt-1">
          Continent: 
          <span class="text-white font-medium">{{ data.attributes.continent }}</span>
        </div>
        <div class="text-sm text-gray-500 mt-1">
          Country: 
          <span class="text-white font-medium">{{ data.attributes.country }}</span>
        </div>
        <div class="text-sm text-gray-500 mt-1">
          ASN: 
          <span class="text-white font-medium">{{ data.attributes.asn }}</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex mt-6 border-b border-gray-700">
      <button class="px-4 py-2 text-green-400 border-b-2 border-green-400">Detection</button>
      <button class="px-4 py-2 text-gray-400 hover:text-white">Details</button>
      <button class="px-4 py-2 text-gray-400 hover:text-white">Relations</button>
      <button class="px-4 py-2 text-gray-400 hover:text-white">Community</button>
    </div>

    <!-- Vendor Table -->
    <div class="mt-6">
      <h3 class="text-lg mb-3 font-semibold">Security vendors' analysis</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr class="text-left bg-gray-700 text-sm">
              <th class="px-4 py-3">Vendor</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(vendor, index) in Object.values(data.attributes.last_analysis_results)" 
              :key="index" 
              class="border-t border-gray-700 text-sm hover:bg-gray-700"
            >
              <td class="px-4 py-2">{{ vendor.engine_name }}</td>
              <td 
                class="px-4 py-2 font-medium" 
                :class="{
                  'text-green-500': vendor.result === 'clean',
                  'text-gray-500': vendor.result === 'unrated',
                  'text-red-500': ['malicious', 'suspicious'].includes(vendor.result),
                }"
              >
                {{ vendor.result || 'undetected' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ip = ref();
const data = ref({ attributes: { last_analysis_results: {} } });

const getIpDetails = async () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  ip.value = route.params.ip;

  const response = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip.value}`, {
    headers: { 'x-apikey': API_KEY } 
  });

  const result = await response.json();
  data.value = result.data;
};

const getFormatteddate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString(); // Convert UNIX timestamp
};

getIpDetails();
</script>

<style scoped>
/* Scoped styles can go here if needed */
</style>
