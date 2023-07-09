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
      path: '/edit/:sequenceCode',
      name: 'SequenceEdit',
      component: import('../views/SequenceEditView.vue'),
      props: true,
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
