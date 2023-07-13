import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(''),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: import('../views/MainView.vue'),
    },
    {
      path: '/login',
      name: 'LogIn',
      component: import('../views/LogInView.vue'),
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
