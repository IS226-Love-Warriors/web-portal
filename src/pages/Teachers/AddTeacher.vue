<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="500px">
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-card-title>
            <v-icon class="mr-2">mdi-clipboard-account</v-icon>
            <span class="headline">Add New Teacher</span>
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="First Name*"
                    v-model="firstName"
                    :rules="[v => !!v || 'First name is required']"
                    required
                    :loading="loading"
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Last Name*"
                    v-model="lastName"
                    :rules="[v => !!v || 'Last name is required']"
                    required
                    :loading="loading"
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    v-model="email"
                    :rules="emailRules"
                    required
                    :loading="loading"
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    v-model="password"
                    :rules="[v => !!v || 'Password is required']"
                    required
                    :loading="loading"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large color="primary" @click="saveForm" :disabled="loading">
            Save
          </v-btn>
          <v-btn large color="grey" text @click="closeModal">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'add-teacher',
  data: () => ({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    loading: false,
    showPassword: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ]
  }),
  props: ['show'],
  methods: {
    closeModal() {
      this.$store.commit('teachers/setShowModal', false)
      this.showPassword = false
      this.$refs.form.reset()
    },
    saveForm() {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return
      }
      let params = {
        email: this.email,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
        account_type: 2
      }
      axios
        .post('user/create.php', params)
        .then(res => {
          if (res.data) {
            this.loading = false
            this.closeModal()
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'success',
              message: res.data.message
            })
            this.$parent.init()
          }
        })
        .catch(err => {
          this.loading = false
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
        })
    }
  }
}
</script>
