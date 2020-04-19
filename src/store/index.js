import Vue from 'vue'
import Vuex from 'vuex'

import loading from './loading'
import session from './session'
import snackbar from './snackbar'

import admins from './admins'
import students from './students'
import teachers from './teachers'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    session,
    snackbar,
    admins,
    students,
    teachers
  }
})
