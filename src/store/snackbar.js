export default {
  strict: true,
  namespaced: true,
  state: {
    show: false,
    message: '',
    type: ''
  },
  mutations: {
    show(state, value) {
      state.show = value
    },
    set(state, value) {
      state.type = value.type
      state.message = value.message
    }
  }
}
