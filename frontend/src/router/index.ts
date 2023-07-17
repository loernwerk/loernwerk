import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import LoginView from '../views/LogInView.vue';
import AccountView from '../views/AccountView.vue';
import SlideView from '../views/SlideView.vue';
import FinishedView from '../views/FinishedView.vue';

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
      component: AccountView,
      meta: { hasNavBar: true },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: import('../views/AdminView.vue'),
    },
    {
      path: '/:code',
      name: 'Slide',
      component: SlideView,
      props: true,
    },
    {
      path: '/:code/finished',
      name: 'Finished',
      component: FinishedView,
      props: true,
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
