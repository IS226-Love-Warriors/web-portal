<template>
  <v-app id="inspire">
    <template v-if="authenticated">
      <v-navigation-drawer v-model="drawer" app clipped>
        <SideMenu></SideMenu>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Mini HomeSchool Module</v-toolbar-title>
      </v-app-bar>

      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col class="shrink">
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-content>

      <v-footer app>
        <span>&copy; IS226 Love Warriors</span>
      </v-footer>
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
  components: { SideMenu, Login },
  props: {
    source: String
  },
  computed: {
    authenticated() {
      return this.$route.path !== '/login'
    }
  },
  data: () => ({
    drawer: null,
    return: {}
  })
  // created () {
  //   this.$vuetify.theme.dark = false
  // },
}
</script>
