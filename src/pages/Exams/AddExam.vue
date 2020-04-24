<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="400">
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-card-title class="headline">
            <v-icon class="mr-2">mdi-clipboard-check-multiple</v-icon>Create New Exam
          </v-card-title>
        </v-toolbar>
        <v-container>
          <v-form ref="form" lazy-validation>
            <v-col cols="12">
              <v-autocomplete
                :items="subjects"
                v-model="subject"
                item-text="subject_name"
                item-value="subject_id"
                label="Subject Name*"
                outlined
                :rules="[v => !!v || 'This is required']"
                hide-details
                :loading="loading"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="description"
                label="Exam Description*"
                outlined
                hide-details
                :rules="[v => !!v || 'This is required']"
                required
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-menu
                v-model="calendar"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Exam Date*"
                    hint="YYYY/MM/DD format"
                    persistent-hint
                    v-on="on"
                    readonly
                    outlined
                    :rules="[v => !!v || 'This is required']"
                    required
                    :loading="loading"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title @input="calendar = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large color="primary" @click="saveForm" :loading="loading" :disabled="loading">Save</v-btn>
          <v-btn large color="grey" text @click="closeModal" :loading="loading">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'add-exam',
  data () {
    return {
      loading: false,
      calendar: false,
      subject: '',
      date: '',
      description: ''
    }
  },
  props: ['show'],
  computed: {
    subjects () {
      return this.$store.state.subjects.list
    }
  },
  methods: {
    closeModal () {
      this.$parent.closeModal()
      this.$refs.form.reset()
    },
    saveForm () {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return
      }
      let params = {
        subject_id: this.subject,
        exam_date: this.date,
        exam_desc: this.description
      }
      axios
        .post('examination/create.php', params)
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
    },
    getAllSubjects () {
      axios
        .get('subject/read-all.php')
        .then(res => {
          let record = res.data.data.records
          this.$store.commit('subjects/setList', record)
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
        })
    }
  },
  mounted () {
    this.getAllSubjects()
  }
}
</script>