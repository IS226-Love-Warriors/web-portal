<template>
  <div>
    <h1>Welcome, {{ firstName }}!</h1>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  computed: {
    firstName() {
      return localStorage.getItem('firstName')
    }
  }
}
</script>

<style></style>
