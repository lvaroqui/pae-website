export default ({ store, redirect }) => {
  if (!store.state.auth.isLoggedIn) {
    redirect('/')
  }
}
