<template>
  <div>
    <v-card class="d-flex">
      <div class="pa-4 pr-0">
        <v-avatar color="primary" size="52">
          <span class="white--text headline">{{firstLetter(profile.first_name, profile.last_name)}}</span>
        </v-avatar>
      </div>
      <div>
        <v-card-title class="pb-1">{{ profile.first_name }} {{ profile.last_name }}</v-card-title>
        <v-card-text class="pb-1">{{ profile.email }}</v-card-text>
        <v-chip class="ma-2 ml-3" color="primary" outlined small>{{account}}</v-chip>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  computed: {
    profile () {
      return JSON.parse(localStorage.getItem('user'))
    },
    account () {
      let role = JSON.parse(localStorage.getItem('user')).account_type
      if (role == 1) {
        return "Admin"
      } else if (role == 2) {
        return "Teacher"
      } else {
        return "Student"
      }
    }
  },
  methods: {
    firstLetter (fname, lname) {
      if (!fname && !lname) { return }
      let initials = fname[0] + lname[0]
      return initials
    }
  }
}
</script>

<style></style>
