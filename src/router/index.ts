import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/contract',
    },
    {
      path: '/contract',
      name: 'contract',
      component: () => import('../views/ContractManagementView.vue'),
      meta: { title: '合同管理' },
    },
  ],
})

export default router
