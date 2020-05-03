<template>
  <div>
    <v-list dense>
      <v-list-item v-for="page in displayPages" :key="page.link" link :to="page.link" color="primary">
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
        { link: '/', icon: 'mdi-view-dashboard', name: 'Dashboard', role: [1, 2, 3] },
        { link: '/admins', icon: 'mdi-account-cog', name: 'Admins', role: [1] },
        { link: '/teachers', icon: 'mdi-clipboard-account', name: 'Teachers', role: [1] },
        { link: '/students', icon: 'mdi-card-account-details', name: 'Students', role: [1, 2] },
        { link: '/subjects', icon: 'mdi-bookshelf', name: 'Subjects', role: [1, 2, 3] },
        { link: '/exams', icon: 'mdi-clipboard-check-multiple', name: 'Exams', role: [1, 2, 3] },
        { link: '/grades', icon: 'mdi-format-list-numbered', name: 'Grades', role: [3] },
        { link: '/profile', icon: 'mdi-account', name: 'Profile', role: [1, 2, 3] }
      ]
    }
  },
  computed: {
    displayPages () {
      const account = parseInt(localStorage.getItem('account'))
      return this.pages.filter((page) => {
        return page.role.includes(account)
      })
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
