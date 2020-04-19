<template>
  <div>
    <v-skeleton-loader :loading="loading" transition="fade-transition" type="list-item-two-line">
      <div>
        <v-btn large color="grey" text class="pa-0" @click="back">
          <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
        </v-btn>
        <v-card>
          <v-card-title>{{ admin.first_name }} {{ admin.last_name }}</v-card-title>
          <v-card-text>{{ admin.email }}</v-card-text>
        </v-card>
      </div>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'admin-profile',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    admin () {
      return this.$store.state.admins.profile
    }
  },
  methods: {
    back () {
      this.$router.push('/admins')
    }
  },
  mounted () {
    this.$store.commit('loading/show', true)
    this.loading = true

    let id = window.location.pathname.split('/')[2]
    id = { user_id: id }
    axios
      .post('user/read-one.php', id)
      .then(res => {
        if (res.data) {
          if (res.data.data.account_type != 1) {
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'error',
              message: 'Record not found'
            })
            this.$store.commit('loading/show', false)
            this.$router.push('/admins')
            return
          }
          this.$store.commit('admins/setProfile', res.data.data)
          this.$store.commit('loading/show', false)
          this.loading = false
        }
      })
      .catch(err => {
        this.$store.commit('snackbar/show', true)
        this.$store.commit('snackbar/set', {
          type: 'error',
          message: err.response.data.message
        })
        this.$store.commit('loading/show', false)
        this.$router.push('/admins')
      })
  }
}
</script>

<style></style>
