import { createRouter, createWebHistory } from '@ionic/vue-router';
import Nav from '../views/Nav.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue'),
  },
  {
    path: '/',
    component: Nav,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/pages/Dashboard.vue'),
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/pages/Profile.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/pages/Setting.vue'),
      },
      {
        path: '/faqs',
        name: 'faqs',
        component: () => import('../views/pages/Faqs.vue'),
      },
      {
        path: '/report',
        name: 'report',
        component: () => import('../views/pages/Report.vue'),
      },
    ],
  },


]


const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  next()
})


export default router
