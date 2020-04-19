import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

import AccessDenied from '@/components/Error/AccessDenied'
import MissingPage from '@/components/Error/404'

import Login from '@/pages/Login'
import Admins from '@/pages/Admins'
import Teachers from '@/pages/Teachers'
import TeacherProfile from '@/pages/Teachers/TeacherProfile'
import Students from '@/pages/Students'
import Grades from '@/pages/Grades'
import Profile from '@/pages/Profile'

import Dashboard from '@/pages/Dashboard'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/admins',
      name: 'Admins',
      component: Admins
    },
    {
      path: '/teachers',
      name: 'Teachers',
      component: Teachers
    },
    {
      path: '/teachers/:id',
      name: 'TeacherProfile',
      component: TeacherProfile
    },
    {
      path: '/students',
      name: 'Students',
      component: Students
    },
    {
      path: '/grades',
      name: 'Grades',
      component: Grades
    },
    {
      path: '*',
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

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    if (localStorage.id !== undefined) {
      next('/')
      return
    }
    next()
    return
  }

  if (localStorage.id === undefined) {
    next('/login')
    return
  }
  next()
})

export default router
