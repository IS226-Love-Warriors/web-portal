<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="500px">
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-card-title>
            <span class="headline">
              <v-icon class="mr-2">mdi-card-account-details</v-icon>
              Add New Student</span
            >
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
                    outlined
                    :loading="loading"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Last Name*"
                    v-model="lastName"
                    :rules="[v => !!v || 'Last name is required']"
                    required
                    outlined
                    :loading="loading"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    v-model="email"
                    :rules="emailRules"
                    required
                    outlined
                    :loading="loading"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    v-model="password"
                    :rules="[v => !!v || 'Password is required']"
                    required
                    outlined
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                    :loading="loading"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Grade Level*"
                    type="number"
                    v-model="gradeLevel"
                    :rules="[
                      v => !!v || 'Grade level is required',
                      v =>
                        v <= 12 ||
                        'Grade level must be between the range of 1 to 12'
                    ]"
                    hint="Input 1-12"
                    outlined
                    required
                    :loading="loading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-select
                    v-model="acadYear"
                    :items="year"
                    :rules="[v => !!v || 'Academic Year is required']"
                    label="Academic Year*"
                    required
                    outlined
                    :loading="loading"
                  ></v-select>
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
  name: 'add-student',
  data: () => ({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gradeLevel: '',
    acadYear: '',
    loading: false,
    showPassword: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    year: ['2019 - 2020', '2018 - 2019']
  }),
  props: ['show'],
  methods: {
    closeModal() {
      this.$store.commit('students/setShowModal', false)
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
        grade_year_level: 'Grade ' + this.gradeLevel,
        acad_year: this.acadYear,
        account_type: 3
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
          } else {
            this.loading = false
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'error',
              message: res.message
            })
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
