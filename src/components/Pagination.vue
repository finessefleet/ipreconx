<!-- components/Pagination.vue -->
<template>
  <div v-if="totalPages > 1">
    <div class="flex justify-center my-3 text-gray-100">Showing {{currentPage}} of {{ totalPages }} pages</div>
    <div class="flex justify-center my-3">
      <button class="px-3 py-1 bg-indigo-500 rounded mx-1 text-gray-100" :hidden="currentPage === 1"
        @click="changePage(1)">First</button>
      <button class="px-3 py-1 bg-indigo-500 rounded mx-1 text-gray-100" :hidden="currentPage === 1"
        @click="changePage(currentPage - 1)">
        <i class="fa fa-chevron-left mr-1"></i>
        Prev</button>

      <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
        class="px-3 py-1 rounded mx-1 text-gray-100"
        :class="currentPage === page ? 'bg-green-600': 'bg-indigo-500'">
        {{ page }}
      </button>

      <button class="px-3 py-1 bg-indigo-500 rounded mx-1 text-gray-100" :hidden="currentPage === totalPages"
        @click="changePage(currentPage + 1)">Next
        <i class="fa fa-chevron-right mr-1"></i>
      </button>
      <button class="px-3 py-1 bg-indigo-500 rounded mx-1 text-gray-100" :hidden="currentPage === totalPages"
        @click="changePage(totalPages)">Last</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:currentPage'])

function changePage(newPage) {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('update:currentPage', newPage)
  }
}

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const range = 2

  const start = Math.max(1, current - range)
  const end = Math.min(total, current + range)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>
