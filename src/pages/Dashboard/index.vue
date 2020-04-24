<template>
  <div>
    <h1>Welcome, {{ firstName }}!</h1>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  computed: {
    firstName () {
      return JSON.parse(localStorage.getItem('user')).first_name
    }
  }
}
</script>

<style></style>
