import { createWebHistory, createRouter } from 'vue-router'

import BlackListedIps from '@/pages/BlackListedIps.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BlackListedIps
    },
    {
      path: '/ip/:ip',
      name: 'ip',
      component: () => import('@/pages/IpDetails.vue')
    }
  ]
})

export default router