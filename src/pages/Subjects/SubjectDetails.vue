<template>
  <v-skeleton-loader :loading="loading" type="article">
    <div>
      <v-btn large color="grey" text class="pa-0" @click="back">
        <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
      </v-btn>
      <v-card>
        <v-card-title>{{ subject.subject_name }}</v-card-title>
        <v-card-text class="py-0">
          <strong>{{ subject.assigned_teacher.name }}</strong>
        </v-card-text>
        <v-card-text class="py-0">{{ subject.grade_year }} ({{ subject.level }})</v-card-text>
        <v-card-text class="pt-0">A.Y. {{ subject.acad_year }}</v-card-text>
      </v-card>
    </div>
  </v-skeleton-loader>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'subject-profile',
  data () {
    return {
    }
  },
  computed: {
    subject () {
      return this.$store.state.subjects.item
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    back () {
      this.$router.push('/subjects')
    }
  },
  mounted () {
    this.$store.commit('loading/show', true)

    let id = window.location.pathname.split('/')[2]
    id = { subject_id: id }
    axios
      .post('subject/read-one.php', id)
      .then(res => {
        if (res.data) {
          this.$store.commit('subjects/setItem', res.data.data)
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
        this.$router.push('/subjects')
      })
  }
}
</script>

<style></style>
