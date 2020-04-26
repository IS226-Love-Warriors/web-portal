import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/Login'
import AccessDenied from '@/components/Error/AccessDenied'
import MissingPage from '@/components/Error/404'

import Profile from '@/pages/Profile'
import Admins from '@/pages/Admins'
import AdminProfile from '@/pages/Admins/AdminProfile'
import Teachers from '@/pages/Teachers'
import TeacherProfile from '@/pages/Teachers/TeacherProfile'
import Students from '@/pages/Students'
import StudentProfile from '@/pages/Students/StudentProfile'

import Exams from '@/pages/Exams'
import ExamDetails from '@/pages/Exams/ExamDetails'
import AnswerExam from '@/pages/Exams/AnswerExam'

import Grades from '@/pages/Grades'
import Subjects from '@/pages/Subjects'
import SubjectDetails from '@/pages/Subjects/SubjectDetails'

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
      component: Admins,
      meta: {
        authorize: [1]
      }
    },
    {
      path: '/admins/:id',
      name: 'AdminProfile',
      component: AdminProfile
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
      component: Students,
      meta: {
        authorize: [1, 2]
      }
    },
    {
      path: '/students/:id',
      name: 'StudentProfile',
      component: StudentProfile
    },
    {
      path: '/exams',
      name: 'Exams',
      component: Exams
    },
    {
      path: '/exams/:id',
      name: 'ExamDetails',
      component: ExamDetails
    },
    {
      path: '/exams/:id/answer',
      name: 'AnswerExam',
      component: AnswerExam,
      meta: {
        authorize: [3]
      }
    },
    {
      path: '/grades',
      name: 'Grades',
      component: Grades
    },
    {
      path: '/subjects',
      name: 'Subjects',
      component: Subjects
    },
    {
      path: '/subjects/:id',
      name: 'SubjectDetails',
      component: SubjectDetails
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

  const { authorize } = to.meta
  const role = parseInt(localStorage.getItem('account'))
  if (authorize) {
    if (!authorize.includes(role)) {
      return next('/accessdenied')
    }
  }

  next()
})

export default router
