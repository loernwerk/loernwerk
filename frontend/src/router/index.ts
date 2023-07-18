import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import LoginView from '../views/LogInView.vue';
import AccountView from '../views/AccountView.vue';
import AdminView from '../views/AdminView.vue';
import SlideView from '../views/SlideView.vue';
import FinishedView from '../views/FinishedView.vue';
import SequenceOverviewView from '../views/SequenceOverviewView.vue';
import SequenceEditView from '../views/SequenceEditView.vue';

const router = createRouter({
  history: createWebHistory(''),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView,
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LoginView,
    },
    {
      path: '/overview',
      name: 'Overview',
      component: SequenceOverviewView,
      meta: { hasNavBar: true },
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
      component: AdminView,
      meta: { hasNavBar: true },
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
    {
      path: '/edit/:code',
      name: 'SequenceEdit',
      component: SequenceEditView,
      meta: { hasNavBar: true },
      props: true,
    },
  ],
});

/**
 * Router to use for switching views.
 */
export { router };
