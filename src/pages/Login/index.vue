<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" style="max-width: 500px;">
          <v-card class="elevation-12">
            <v-toolbar dark flat v-if="!isError">
              <v-toolbar-title>
                <v-icon>mdi-view-dashboard</v-icon>Mini HomeSchool User Login
              </v-toolbar-title>
            </v-toolbar>
            <v-alert type="error" v-show="isError">{{ errorMessage }}</v-alert>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Username"
                  v-model="email"
                  prepend-icon="person"
                  type="text"
                  autocomplete="off"
                  ref="email"
                  :error="isError"
                  @focus="clearError"
                  :disabled="isLoading"
                  :loading="isLoading"
                />

                <v-text-field
                  id="password"
                  label="Password"
                  v-model="password"
                  prepend-icon="lock"
                  type="password"
                  autocomplete="off"
                  v-on:keyup.enter="login"
                  :error="isError"
                  :disabled="isLoading"
                  :loading="isLoading"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                x-large
                @click="login"
                :disabled="isLoading || isError"
                :loading="isLoading"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import axios from '@/axios'
export default {
  props: {
    source: String
  },
  data() {
    return {
      email: '',
      password: '',
      isError: false,
      errorMessage: '',
      isLoading: false
    }
  },
  methods: {
    login() {
      this.isError = false

      if (this.isLoading) {
        return
      }

      let params = {
        email: this.email,
        password: this.password
      }
      this.isLoading = true
      axios
        .post('user/login.php', params)
        .then(res => {
          this.isLoading = false
          if (res.data) {
            this.$store.commit('session/setUser', res.data.data)
            this.$router.push('/')
          } else {
            this.isError = true
            this.errorMessage = 'Incorrect username or password'
            setTimeout(() => {
              this.$refs.email.focus()
            }, 3500)
          }
        })
        .catch(error => {
          this.isLoading = false
          this.isError = true
          this.errorMessage = error
        })

      setTimeout(() => {
        this.clearError()
      }, 3500)
    },
    clearError() {
      if (this.isError === false) {
        return
      }
      this.isError = false
      this.email = ''
      this.password = ''
    }
  }
}
</script>
