<template>
  <v-skeleton-loader :loading="loading" type="article">
    <div>
      <v-btn large color="grey" text class="pa-0" @click="back">
        <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
      </v-btn>
      <v-card class="d-flex">
        <div class="pa-4 pr-0">
          <v-avatar color="primary" size="52">
            <span class="white--text headline">{{firstLetter(teacher.first_name, teacher.last_name)}}</span>
          </v-avatar>
        </div>
        <div>
          <v-card-title class="pb-1">{{ teacher.first_name }} {{ teacher.last_name }}</v-card-title>
          <v-card-text>{{ teacher.email }}</v-card-text>
        </div>
      </v-card>
    </div>
  </v-skeleton-loader>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'teacher-profile',
  data () {
    return {
    }
  },
  computed: {
    teacher () {
      return this.$store.state.teachers.profile
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    back () {
      this.$router.push('/teachers')
    },
    firstLetter (fname, lname) {
      let initials = fname[0] + lname[0]
      return initials
    }
  },
  mounted () {
    this.$store.commit('loading/show', true)

    let id = window.location.pathname.split('/')[2]
    id = { user_id: id }
    axios
      .post('user/read-one.php', id)
      .then(res => {
        if (res.data) {
          if (res.data.data.account_type != 2) {
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'error',
              message: 'Record not found'
            })
            this.$store.commit('loading/show', false)
            this.$router.push('/teachers')
            return
          }
          this.$store.commit('teachers/setProfile', res.data.data)
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
        this.$router.push('/teachers')
      })
  }
}
</script>

<style></style>
