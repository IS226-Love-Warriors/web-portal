<template>
  <div>
    <v-skeleton-loader :loading="loading" type="card">
      <v-card>
        <v-card-title class="justify-center">{{ examDetails ? examDetails.exam_text : '' }}</v-card-title>
      </v-card>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'answer-exam',

  data () {
    return {}
  },
  computed: {
    loading () { return this.$store.state.loading.show },
    examDetails () {
      return this.$store.state.exams.item.exam_details
    },
    exams () {
      return this.$store.state.exams.item.records
    },
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)

      let id = window.location.pathname.split('/')[2]
      console.log(id)
      this.id = id
      id = { exam_id: id }
      axios
        .post('answer/read-choices.php', id)
        .then(res => {
          if (res.data) {
            this.$store.commit('exams/setItem', res.data.data)
            this.$store.commit('loading/show', false)
          }
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.response.data.message
          })
          this.$store.commit('loading/show', false)
          this.$router.push('/exams')
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