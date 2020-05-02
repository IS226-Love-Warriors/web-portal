export default {
  strict: true,
  namespaced: true,
  state: {
    admin: {
      list: []
    }
  },
  mutations: {
    setAdminList(state, value) {
      state.admin.list = value
    }
  }
}
