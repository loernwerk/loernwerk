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
      path: '/:code',
      name: 'Slide',
      component: import('../views/SlideView.vue'),
    },
    {
      path: '/:code/finished',
      name: 'Finished',
      component: import('../views/FinishedView.vue'),
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
