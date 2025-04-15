/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const defaultRoute = {
  path: '/',
  name: 'Default',
  component: () => import('@/pages/login.vue')
}

// Add a default route to the signup page
const signupRoute = {
  path: '/',
  name: 'Signup',
  component: () => import('@/pages/signup.vue')
}

// Add a route for the login page
const loginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/pages/login.vue')
}

// Add a route for the dashboard page
const dashboardRoute = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/pages/dashboard.vue')
}

// Add the default route and login route to the routes array
const updatedRoutes = [
  defaultRoute,
  signupRoute,
  loginRoute,
  dashboardRoute,
  ...routes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: updatedRoutes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
