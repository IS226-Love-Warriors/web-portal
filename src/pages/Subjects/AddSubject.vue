<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="500px">
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-card-title>
            <span class="headline">
              <v-icon class="mr-2">mdi-bookshelf</v-icon>Add New Subject
            </span>
          </v-card-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Subject Name*"
                    v-model="subjectName"
                    :rules="[v => !!v || 'Subject name is required']"
                    required
                    outlined
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
          <v-btn large color="primary" @click="saveForm" :disabled="loading">Save</v-btn>
          <v-btn large color="grey" text @click="closeModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'add-subject',
  data: () => ({
    subjectName: '',
    gradeLevel: '',
    acadYear: '',
    loading: false,
    year: ['2019 - 2020', '2018 - 2019']
  }),
  props: ['show'],
  methods: {
    closeModal () {
      this.$store.commit('subjects/setShowModal', false)
      this.$refs.form.reset()
    },
    saveForm () {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return
      }
      let level = ''
      if (this.gradeLevel <= 6) {
        level = 'Elementary'
      } else if (this.gradeLevel <= 10) {
        level = 'Junior High School'
      } else {
        level = 'Senior High School'
      }
      let params = {
        subject_name: this.subjectName,
        level: level,
        grade_year: 'Grade ' + this.gradeLevel,
        acad_year: this.acadYear,
        assigned_teacher: 'tchr001'
      }
      axios
        .post('subject/create.php', params)
        .then(res => {
          if (res.data.message) {
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
