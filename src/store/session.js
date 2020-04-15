export default {
  strict: true,
  namespaced: true,
  state: {
    user: {
      id: null,
      role: null
    }
  },
  mutations: {
    setUser(state, value) {
      state.user = value
    }
  }
}