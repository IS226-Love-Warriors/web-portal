<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" style="max-width: 500px;">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>Mini HomeSchool User Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Username"
                  v-model="email"
                  prepend-icon="person"
                  type="text"
                  autocomplete="new-password"
                  :error="isError"
                />

                <v-text-field
                  id="password"
                  label="Password"
                  v-model="password"
                  prepend-icon="lock"
                  type="password"
                  autocomplete="new-password"
                  v-on:keyup.enter="login"
                  :error="isError"
                />
              </v-form>
            </v-card-text>
            <v-alert type="error" v-show="isError">
              Incorrect username or password
            </v-alert>
            <v-card-actions>
              <v-btn color="primary" block @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  props: {
    source: String
  },
  data() {
    return {
      email: '',
      password: '',
      isError: false
    }
  },
  methods: {
    login() {
      this.isError = false
      if (this.email === 'admin' && this.password === 'qwerty') {
        this.$store.commit('session/setUser', {
          id: 1,
          firstName: 'Admin1'
        })
        localStorage.setItem('id', this.$store.state.session.user.id)
        this.$router.push('/')
      } else {
        this.isError = true
      }
    }
  }
}
</script>
