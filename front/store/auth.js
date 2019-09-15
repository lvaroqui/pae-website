export const state = () => ({
  isLoggedIn: false,
  user: null
})

export const mutations = {
  loggedIn(state, user) {
    state.isLoggedIn = true
    state.user = user
  },
  loggedOut(state) {
    state.isLoggedIn = false
    state.user = null
  }
}
