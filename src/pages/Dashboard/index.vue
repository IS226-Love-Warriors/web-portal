<template>
  <div>
    <h1>Welcome, {{user.firstName}}!</h1>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  computed: {
    user () { return this.$store.state.session.user }
  }
}
</script>

<style>
</style>