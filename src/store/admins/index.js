export default {
  strict: true,
  namespaced: true,
  state: {
    list: [],
    showModal: false,
    profile: {}
  },
  mutations: {
    setList(state, value) {
      state.list = value
    },
    setShowModal(state, value) {
      state.showModal = value
    },
    setProfile(state, value) {
      state.profile = value
    }
  }
}
