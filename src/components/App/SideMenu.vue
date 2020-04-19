<template>
  <div>
    <v-list dense>
      <v-list-item link to="/" color="primary">
        <v-list-item-action>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/admins" color="primary">
        <v-list-item-action>
          <v-icon>mdi-account-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Admins</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/teachers" color="primary">
        <v-list-item-action>
          <v-icon>mdi-clipboard-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Teachers</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/students" color="primary">
        <v-list-item-action>
          <v-icon>mdi-card-account-details</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Students</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/grades" color="primary">
        <v-list-item-action>
          <v-icon>mdi-cog-outline</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Grades</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/profile" color="primary">
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
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
  data() {
    return {}
  },
  methods: {
    logOut() {
      sessionStorage.clear()
      localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
