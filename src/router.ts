import {createRouter, createWebHistory} from 'vue-router';

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
  },
  {
    name: 'perlin-noise',
    path: '/perlin-noise',
    component: ()=>import('./pages/perlin-noise.vue'),
    meta: {
      title: '柏林噪声'
    }
  }
];

export default createRouter({
  routes,
  history: createWebHistory()
})