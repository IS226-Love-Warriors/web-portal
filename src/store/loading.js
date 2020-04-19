export default {
  strict: true,
  namespaced: true,
  state: {
    show: false
  },
  mutations: {
    show(state, value) {
      state.show = value
    }
  }
}
