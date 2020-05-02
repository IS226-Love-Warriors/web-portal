<template>
  <div>
    <v-skeleton-loader :loading="loading" type="article">
      <v-card>
        <v-card-title>Subject</v-card-title>
      </v-card>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'
export default {
  data: () => ({
    loading: false
  }),
  computed: {

  },
  methods: {
    init () {
      this.loading = true
      let id = window.location.pathname.split('/')[2]
      id = { student_id: id }
      axios
        .post('grades/read-grade-student.php', id)
        .then(res => {
          if (res.data) {
            this.$store.commit('students/setGrades', res.data.data)
            this.loading = false
          }
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.response.data.message
          })
          this.loading = false
          this.$router.push('/students')
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
</style>