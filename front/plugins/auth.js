import extend from '~/utils/extend-vue-app'

// eslint-disable-next-line require-await
export default async function({ app }) {
  extend(app, {
    mounted() {
      this.$axios.get('/users/me', { withCredentials: true }).then((res) => {
        if (res.status === 200) {
          this.$store.commit('auth/loggedIn', res.data)
        } else {
          this.$store.commit('auth/loggedOut')
        }
      })
    }
  })
}
