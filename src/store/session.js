export default {
  strict: true,
  namespaced: true,
  state: {
    user: {
      id: null,
      email: '',
      firstName: '',
      lastName: ''
    }
  },
  mutations: {
    setUser(state, value) {
      state.user.id = value.id
      state.user.email = value.email
      state.user.firstName = value.first_name
      state.user.lastName = value.last_name
    }
  }
}
