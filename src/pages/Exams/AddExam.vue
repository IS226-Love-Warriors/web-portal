<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="400">
      <v-card>
        <v-toolbar dark color="primary" flat>
          <v-card-title class="headline">
            <v-icon class="mr-2">mdi-clipboard-check-multiple</v-icon>Create New Exam
          </v-card-title>
        </v-toolbar>
        <v-container class="pa-6">
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :items="subjects"
                  v-model="subject"
                  item-text="subject_name"
                  item-value="subject_id"
                  label="Select Subject*"
                  outlined
                  :rules="[v => !!v || 'This is required']"
                  hide-details
                  :loading="loading"
                  @change="getCriteria"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <div v-show="subject">
              <v-skeleton-loader :loading="loading" type="card">
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      :items="criterias"
                      v-model="criteria"
                      item-text="criteria_name"
                      item-value="criteria_id"
                      label="Criteria*"
                      outlined
                      :rules="[v => !!v || 'This is required']"
                      hide-details
                      :loading="loading"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
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
                </v-row>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <v-select
                      :items="period"
                      label="Grading Period"
                      outlined
                      required
                      v-model="grading_period"
                      :rules="[v => !!v ]"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
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
                      <v-date-picker v-model="date" @input="calendar = false" :min="currentDate"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-skeleton-loader>
            </div>
          </v-form>
        </v-container>
        <v-card-actions v-if="subject">
          <v-spacer></v-spacer>
          <v-btn large color="primary" @click="saveForm" :loading="loading" :disabled="loading">Save</v-btn>
          <v-btn large color="grey" text @click="closeModal" :loading="loading">Cancel</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
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
      calendar: false,
      subject: '',
      criteria: '',
      date: '',
      description: '',
      period: [1, 2, 3, 4],
      grading_period: ''
    }
  },
  props: ['show'],
  computed: {
    subjects () {
      return this.$store.state.subjects.list
    },
    criterias () {
      return this.$store.state.subjects.item.criterias
    },
    loading () {
      return this.$store.state.loading.show
    },
    currentDate () {
      return new Date().toISOString().substr(0, 10)
    }
  },
  methods: {
    getCriteria () {
      this.$store.commit('loading/show', true)
      let id = { subject_id: this.subject }
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
        })
    },
    closeModal () {
      this.$store.commit('subjects/resetItem')
      this.$parent.closeModal()
      this.$refs.form.reset()
    },
    saveForm () {
      this.$store.commit('loading/show', true)
      if (!this.$refs.form.validate()) {
        this.$store.commit('loading/show', false)
        return
      }
      let params = {
        subject_id: this.subject,
        exam_date: this.date,
        exam_desc: this.description,
        criteria_id: this.criteria,
        grading_period: this.grading_period
      }
      axios
        .post('examination/create.php', params)
        .then(res => {
          if (res.data.message) {
            this.$store.commit('loading/show', false)
            this.closeModal()
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'success',
              message: res.data.message
            })
            this.$parent.init()
            this.$router.push('/exams/' + res.data.data.exam_id)
          } else {
            this.$store.commit('loading/show', false)
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'error',
              message: res.message
            })
          }
        })
        .catch(err => {
          this.$store.commit('loading/show', false)
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
    },
    getSubjByTeacher () {
      this.$store.commit('loading/show', true)
      let params = {
        teacher_id: localStorage.getItem('id')
      }
      axios
        .post('subject/read-teacher-subject.php', params)
        .then(res => {
          if (res.data.data) {
            let record = res.data.data.records
            this.$store.commit('subjects/setList', record)
            this.$store.commit('loading/show', false)
          } else {
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'error',
              message: res.data.message
            })
            this.$store.commit('loading/show', false)
          }
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
          this.$store.commit('loading/show', false)
        })
    }
  },
  mounted () {
    switch (localStorage.getItem('account')) {
      case '1':
        this.getAllSubjects()
        break
      case '2':
        this.getSubjByTeacher()
        break
    }
  }
}
</script>