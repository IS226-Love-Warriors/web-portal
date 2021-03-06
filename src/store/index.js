import Vue from 'vue'
import Vuex from 'vuex'

import loading from './loading'
import session from './session'
import snackbar from './snackbar'

import admins from './admins'
import students from './students'
import teachers from './teachers'

import subjects from './subjects'
import exams from './exams'

import grades from './grades'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    session,
    snackbar,
    admins,
    students,
    teachers,
    subjects,
    exams,
    grades
  }
})
