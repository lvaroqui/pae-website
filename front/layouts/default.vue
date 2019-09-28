<template>
  <v-app>
    <v-app-bar color="dark-grey" app dark :clipped-left="clipped">
      <v-app-bar-nav-icon class="d-lg-none" @click="drawer = !drawer" />
      <v-toolbar-title>
        <v-avatar>
          <img src="~/assets/img/logo-pae.png" alt="logo-pae" />
        </v-avatar>
        <span>PAE UTC</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn
        v-if="!$store.state.auth.isLoggedIn"
        href="http://localhost:3001/auth"
      >
        Connexion <v-icon right>mdi-login</v-icon>
      </v-btn>
      <v-btn v-else href="http://localhost:3001/auth/logout">
        Déconnexion <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app :clipped="clipped">
      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          nuxt
          link
        >
          <v-list-item-icon>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container style="background-color:white; height:100%" fluid>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Default',
  middleware: ['auth'],
  data() {
    return {
      drawer: null // Is the nav drawer out ?
    }
  },
  computed: {
    // Available routes
    items() {
      const items = [
        {
          title: 'Accueil',
          icon: 'mdi-home',
          to: '/',
          color: 'orange'
        }
      ]
      // If user is connected
      if (this.$store.state.auth.isLoggedIn) {
        items.push({
          title: 'Réservations',
          icon: 'mdi-calendar',
          to: '/booking',
          color: 'blue'
        })

        // If user is Admin
        if (this.$store.state.auth.user.isAdmin) {
          items.push({
            title: 'Administration',
            icon: 'mdi-file-account',
            to: '/admin',
            color: 'green'
          })
        }
      }
      return items
    },

    // Set the drawer and nav bar to clip on big dislays
    clipped() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return false
        case 'sm':
          return false
        case 'md':
          return false
        case 'lg':
          return true
        case 'xl':
          return true
        default:
          return false
      }
    }
  }
}
</script>
