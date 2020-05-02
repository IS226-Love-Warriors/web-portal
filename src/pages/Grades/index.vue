<template>
  <div></div>
</template>
<script>
export default {
  created () {
    let account = localStorage.getItem('account')
    switch (account) {
      case '1':
        this.$router.push('grades/admin')
        break
      case '2':
        this.$router.push('grades/teacher')
        break
      case '3':
        this.$router.push('grades/student')
        break
    }
  }
}
</script>