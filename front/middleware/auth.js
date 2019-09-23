export default ({ store, $axios }) => {
  return $axios
    .get('/users/me', { withCredentials: true })
    .then((res) => {
      store.commit('auth/loggedIn', res.data)
    })
    .catch(() => {
      store.commit('auth/loggedOut')
    })
}
