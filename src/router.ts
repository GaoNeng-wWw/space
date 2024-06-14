import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

export const routes = [
  {
    name: 'Home',
    path: '/',
    component: ()=>import('./pages/home.vue'),
  },
  {
    name: 'particle',
    path: '/particle',
    component: ()=>import('./pages/particle.vue'),
    meta: {
      title: '粒子星球'
    }
  }
];

export default createRouter({
  routes,
  history: createWebHistory()
})