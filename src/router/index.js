import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/orgRes',
      name: 'orgRes',
      component: () => import('../views/OrganiseResourceView.vue'),
    },
    {
      path: '/orgBook',
      name: 'orgBook',
      component: () => import('../views/BookManagementView.vue'),
    },
    {
      path: '/lineRecite',
      name: 'lineRecite',
      component: () => import('../views/LineReciteView.vue'),
    },
    {
      path: '/randomRecite',
      name: 'randomRecite',
      component: () => import('../views/RandomReciteView.vue'),
    },
    {
      path: '/extractWordRecite',
      name: 'extractWordRecite',
      component: () => import('../views/ExtractWordReciteView.vue'),
    },
  ],
});

export default router;
