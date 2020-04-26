<template>
  <div>
    <h1>Welcome, {{ firstName }}!</h1>
    <h2>Role: {{account}}</h2>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  computed: {
    firstName () {
      return JSON.parse(localStorage.getItem('user')).first_name
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
  }
}
</script>

<style></style>
