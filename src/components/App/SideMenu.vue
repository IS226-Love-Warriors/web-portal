<template>
  <div>
    <v-list dense>
        <v-list-item link to="/">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/grades">
            <v-list-item-action>
              <v-icon>mdi-cog-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Grades</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/profile">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
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
    return {}
  }
}
</script>

<style>

</style>