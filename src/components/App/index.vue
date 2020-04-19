<template>
  <v-app id="inspire">
    <template v-if="authenticated">
      <v-navigation-drawer v-model="drawer" app clipped>
        <SideMenu></SideMenu>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Mini HomeSchool Module</v-toolbar-title>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          bottom
        >
        </v-progress-linear>
      </v-app-bar>

      <v-content>
        <v-container fluid>
          <v-row>
            <v-col>
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-content>

      <v-footer app>
        <span>&copy; IS226 Love Warriors</span>
      </v-footer>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.type"
        bottom
        right
        multi-line
      >
        {{ snackbar.message }}
        <v-btn dark text @click="closeSnackbar">
          Close
        </v-btn>
      </v-snackbar>
    </template>
    <template v-else>
      <login></login>
    </template>
  </v-app>
</template>

<script>
import SideMenu from './SideMenu'
import Login from '@/pages/Login'

export default {
  name: 'app',
  data: () => ({
    drawer: null,
    return: {}
  }),
  components: { SideMenu, Login },
  computed: {
    authenticated() {
      return this.$route.path !== '/login'
    },
    loading() {
      return this.$store.state.loading.show
    },
    snackbar() {
      return this.$store.state.snackbar
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.commit('snackbar/show', false)
      this.$store.commit('snackbar/set', { type: '', message: '' })
    }
  }
}
</script>
