export default {
  strict: true,
  namespaced: true,
  state: {
    list: [],
    showModal: false,
    profile: {},
    grades: [],
    criteria: []
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
    },
    setGrades(state, value) {
      state.grades = value
    },
    setCriteria(state, value) {
      state.criteria = value
    }
  }
}
