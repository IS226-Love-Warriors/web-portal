<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="500px">
      <v-card v-if="stepForm == 0">
        <v-toolbar dark color="primary" flat>
          <v-card-title>
            <span class="headline">
              <v-icon class="mr-2">mdi-bookshelf</v-icon>Add New Subject (1/2)
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
                <v-col cols="12">
                  <v-autocomplete
                    :items="teachers"
                    v-model="teacher"
                    item-text="name"
                    item-value="id"
                    label="Assigned Teacher*"
                    outlined
                    :rules="[v => !!v || 'This is required']"
                    hide-details
                  ></v-autocomplete>
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
          <v-btn large color="grey" text @click="closeModal">Cancel</v-btn>
          <v-btn large color="primary" @click="next" :disabled="loading">Next</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else>
        <v-toolbar dark color="primary" flat>
          <v-card-title>
            <span class="headline">
              <v-icon class="mr-2">mdi-bookshelf</v-icon>Create Grade Matrix (2/2)
            </span>
          </v-card-title>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-row v-for="(input, i) in criteria" :key="i">
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    label="Criteria Name*"
                    v-model="input.criteria_name"
                    :rules="[v => !!v]"
                    required
                    outlined
                    :loading="loading"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    label="Percentage*"
                    v-model="input.percentage"
                    :rules="[
                      v =>
                        (v <= 100 && v >= 1)
                    ]"
                    required
                    outlined
                    hide-details
                    type="number"
                    :loading="loading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="2" class="d-flex pa-0">
                  <v-icon
                    @click="remove(i)"
                    class="mr-1"
                    color="error"
                    v-show="i || ( !i && criteria.length > 1)"
                    large
                  >mdi-minus-circle</v-icon>
                  <v-icon @click="add()" color="success" v-show="i == criteria.length-1" large>mdi-plus-circle</v-icon>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <span style="color: red;" v-show="hasError">*Sum of percentage must be equal to 100%</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large color="grey" text @click="closeModal">Cancel</v-btn>
          <v-btn large color="primary" @click="saveForm" :disabled="loading">Save</v-btn>
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
    teacher: '',
    gradeLevel: '',
    acadYear: '',
    stepForm: 0,
    loading: false,
    hasError: false,
    year: ['2019 - 2020', '2018 - 2019'],
    criteria: [
      { criteria_name: '', percentage: 0 }
    ]
  }),
  props: ['show'],
  computed: {
    teachers () {
      return this.$store.state.teachers.list
    }
  },
  methods: {
    closeModal () {
      this.subjectName = ''
      this.teacher = ''
      this.gradeLevel = ''
      this.acadYear = ''
      this.$store.commit('subjects/setShowModal', false)
      this.$refs.form.reset()
      this.stepForm = 0
    },
    add () {
      this.criteria.push({ criteria_name: '', percentage: 0 })
    },
    remove (index) {
      this.criteria.splice(index, 1)
    },
    next () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.stepForm++
    },
    checkPercentage () {
      let total = 0
      this.criteria.forEach((x) => {
        total += parseInt(x.percentage)
      })
      if (total != 100) {
        this.hasError = true
        this.loading = false
        return false
      }
      return true
    },
    saveForm () {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return
      }
      if (this.checkPercentage()) {
        this.saveToDB()
      }
    },
    saveToDB () {
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
        assigned_teacher: this.teacher,
        criteria: this.criteria
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
    },
    getAllTeachers () {
      this.$store.commit('loading/show', true)
      axios
        .get('user/read-all.php')
        .then(res => {
          let teacher = res.data.users
          teacher = teacher.filter(x => x.account_type == '2')
          teacher = teacher.map(x => ({
            name: `${x.first_name} ${x.last_name}`,
            id: x.id
          }))
          this.$store.commit('teachers/setList', teacher)
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
    this.getAllTeachers()
  }
}
</script>
