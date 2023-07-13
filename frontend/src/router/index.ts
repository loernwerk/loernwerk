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
    {
      path: '/account',
      name: 'Account',
      component: import('../views/AccountView.vue'),
    },
    {
      path: '/:code',
      name: 'Slide',
      component: import('../views/SlideView.vue'),
      props: true,
    },
    {
      path: '/:code/finished',
      name: 'Finished',
      component: import('../views/FinishedView.vue'),
      props: true,
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
