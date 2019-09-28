export default ({ store, redirect }) => {
  if (store.state.auth.user.assos.length === 0) {
    redirect('/')
  }
}
