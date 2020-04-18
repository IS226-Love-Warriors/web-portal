export default {
  strict: true,
  namespaced: true,
  state: {
    user: {
      id: null,
      email: '',
      firstName: '',
      lastName: '',
      account: null
    }
  },
  mutations: {
    setUser(state, value) {
      state.user.id = value.id
      state.user.email = value.email
      state.user.firstName = value.first_name
      state.user.lastName = value.last_name
      state.user.account = value.account_type
      localStorage.setItem('id', value.id)
      localStorage.setItem('email', value.email)
      localStorage.setItem('firstName', value.first_name)
      localStorage.setItem('lastName', value.last_name)
      localStorage.setItem('account', value.account_type)
    }
  }
}
