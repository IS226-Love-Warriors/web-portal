import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

import AccessDenied from '@/components/Error/AccessDenied'
import MissingPage from '@/components/Error/404'

import Login from '@/components/App/Login'
import Grades from '@/components/Grades'
import Profile from '@/components/Profile'

import Dashboard from '@/components/Dashboard'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/grades',
      name: 'Grades',
      component: Grades
    },
    {
      path: '/thispagedoesnotexist',
      name: 'MissingPage',
      component: MissingPage
    },
    {
      path: '/accessdenied',
      name: 'AccessDenied',
      component: AccessDenied
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
  ],
  mode: 'history'
})

// router.beforeEach((to, from, next) => {
//   if (to.name === null) {
//     next('/thispagedoesnotexist')
//     return
//   }
//   if (to.name === 'Login') {
//     if (store.state.session.user.id !== null) {
//       next('/')
//       return
//     }
//     // store.commit('sideMenu/hide')
//     next()
//     return
//   }

//   if (store.state.session.user.id === null) {
//     // check session token
//     let sessionToken = router.app.$plugins.storage.getSessionToken()
//     if (sessionToken === null) {
//       store.commit('sideMenu/hide')
//       next('/login')
//       return
//     }

//     store.commit('session/showLoader')
//     router.app.$sdk.get('/admin/auth', {
//       token: sessionToken
//     }, r => {
//       store.commit('session/hideLoader')
//       store.commit('sideMenu/hide')
//       if (r.error) {
//         router.app.$plugins.storage.removeSessionToken()
//         next('/login')
//         return
//       }
//       store.commit('session/setUser', {
//         id: r.id,
//         firstName: r.firstName,
//         lastName: r.lastName,
//         phone: r.phone,
//         email: r.email,
//         photoUrl: r.avatarUrl === null ? 'https://s3-us-west-2.amazonaws.com/staging-backoffice/staging/default-user.jpg' : r.avatarUrl,
//         access: r.access.permissions,
//         accessLoad: false
//       })
//       store.commit('session/setSessionToken', sessionToken)
//       router.app.$plugins.storage.setSessionToken(sessionToken)
//       router.app.$plugins.fcm.start(router.app)

//       next()
//     })

//     return
//   }
//   store.commit('sideMenu/hide')
//   next()
// })

export default router