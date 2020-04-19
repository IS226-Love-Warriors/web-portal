export default {
  strict: true,
  namespaced: true,
  state: {
    list: [],
    showModal: false
  },
  mutations: {
    setList(state, value) {
      state.list = value
    },
    setShowModal(state, value) {
      state.showModal = value
    }
  }
}
