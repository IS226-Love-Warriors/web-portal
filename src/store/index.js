import Vue from 'vue'
import Vuex from 'vuex'

import loading from './loading'
import session from './session'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    session
  }
})
