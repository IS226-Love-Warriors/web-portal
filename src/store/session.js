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
      state.user = value
      localStorage.setItem('id', value.id)
      localStorage.setItem('account', value.account_type)
      localStorage.setItem('user', JSON.stringify(value))
    }
  }
}
