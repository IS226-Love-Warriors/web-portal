<template>
  <div>
    <v-list dense>
      <v-list-item v-for="page in pages" :key="page.link" link :to="page.link" color="primary">
        <v-list-item-action>
          <v-icon>{{page.icon}}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{page.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logOut" color="primary">
        <v-list-item-action>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'side-menu',
  data () {
    return {
      pages: [
        { link: '/', icon: 'mdi-view-dashboard', name: 'Dashboard' },
        { link: '/admins', icon: 'mdi-account-cog', name: 'Admins' },
        { link: '/teachers', icon: 'mdi-clipboard-account', name: 'Teachers' },
        { link: '/students', icon: 'mdi-card-account-details', name: 'Students' },
        { link: '/subjects', icon: 'mdi-bookshelf', name: 'Subjects' },
        { link: '/exams', icon: 'mdi-clipboard-check-multiple', name: 'Exams' },
        { link: '/grades', icon: 'mdi-format-list-numbered', name: 'Grades' },
        { link: '/profile', icon: 'mdi-account', name: 'Profile' }
      ]
    }
  },
  methods: {
    logOut () {
      sessionStorage.clear()
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
