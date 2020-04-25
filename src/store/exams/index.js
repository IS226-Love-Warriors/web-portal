export default {
  strict: true,
  namespaced: true,
  state: {
    list: [],
    showModal: false,
    item: {
      records: []
    }
  },
  mutations: {
    setList(state, value) {
      state.list = value
    },
    setShowModal(state, value) {
      state.showModal = value
    },
    setItem(state, value) {
      state.item = value
    }
  }
}
