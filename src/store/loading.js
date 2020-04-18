export default {
  strict: true,
  namespaced: true,
  state: {
    show: false
  },
  mutations: {
    showLoading(state, value) {
      state.show = value
    }
  }
}
