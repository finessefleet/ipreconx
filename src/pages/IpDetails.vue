<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 font-sans">
    <!-- Header -->
    <div class="flex flex-col md:flex-row gap-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div class="flex flex-col items-center justify-center bg-gray-700 w-32 h-32">
        <div class="flex flex-col items-center justify-center bg-gray-700 w-32 h-32">
          <div class="text-3xl font-bold text-gray-300">
            <span :class="communityScore ? 'text-red-500': 'text-green-500'">{{ communityScore }}</span>/{{ Object.keys(data.attributes.last_analysis_results).length }}
          </div>
          <div class="text-xs" >Community score: <span :class="communityScore ? 'text-red-500': 'text-green-500'">{{ data.attributes.reputation }}</span></div>
        </div>
      </div>

      <div class="flex-1">
        <p class="text-sm text-gray-400 mb-2" v-if="communityScore">
          <span :class="communityScore ? 'text-red-500': 'text-green-500'">{{communityScore}}/{{ Object.keys(data.attributes.last_analysis_results).length }} security vendors flagged this IP address as malicious</span>
        </p>
        <h2 class="text-xl font-semibold">
          {{ ip }} 
          <span class="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded ml-2">
            {{data.attributes.as_owner}}
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
              v-for="(vendor, index) in vendors" 
              :key="index" 
              class="border-t border-gray-700 text-sm hover:bg-gray-700"
            >
              <td class="px-4 py-2">{{ vendor[0] }}</td>
              <td class="px-4 py-2 font-medium capitalize" >
                <span v-if="vendor[1].result === 'clean'" class="text-green-500">
                  <i class="fa fa-circle-check mr-1"></i> Clean
                </span>
                <span v-else-if="vendor[1].result === 'unrated'" class="text-gray-500">
                  <i class="fa fa-question mr-1"></i> Unrated
                </span>
                <span v-else-if="['malicious','phishing', 'malware'].includes(vendor[1].result)" class="text-red-500">
                  <i class="fa fa-circle-exclamation mr-1"></i> {{vendor[1].result}}
                </span>
                <span v-else-if="vendor[1].result === 'suspicious'" class="text-yellow-500">
                  <i class="fa fa-circle-exclamation mr-1"></i>{{vendor[1].result}}
                </span>
                <span v-else class="text-gray-500">
                  <i class="fa fa-question mr-1"></i> Unrated
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

:class="{
                  '': 
                  'text-gray-500': vendor[1].result === 'unrated',
                  'text-red-500': ,
                  'text-yellow-500': vendor[1].result === 'suspicious'
                }">
                  {{ vendor[1].result || 'undetected' }}

<script setup>
import { ref, computed } from 'vue';
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

const vendors = computed(() => {
  const customOrder = ["malicious", "phishing", "suspicious","clean","unrated"];
  const sortedEntries = Object.entries(data.value.attributes.last_analysis_results).sort(([, a], [, b]) => {
    return customOrder.indexOf(a.result) - customOrder.indexOf(b.result);
  });
  console.log('sortedEntries', sortedEntries)
  return sortedEntries;
});

const getFormatteddate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString(); // Convert UNIX timestamp
};

const communityScore = computed(() => {
  const votes = data.value?.attributes?.last_analysis_stats || {};
  return votes.malicious || 0;
});

getIpDetails();
</script>

<style scoped>
/* Scoped styles can go here if needed */
</style>
