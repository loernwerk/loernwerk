import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import LoginView from '../views/LogInView.vue';

const router = createRouter({
  history: createWebHistory(''),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView,
      meta: { hasNavBar: true },
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LoginView,
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
