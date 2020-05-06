<template>
  <div>
    <v-skeleton-loader :loading="loading" type="card">
      <v-row>
        <v-col align="end" class="pt-1">
          <v-btn color="primary" @click="openModal">
            <v-icon class="mr-2">mdi-clipboard-check-multiple</v-icon>Add Exam
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-clipboard-check-multiple</v-icon>Exams
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>

        <v-data-table :headers="headers" :items="exams" :search="search">
          <template v-slot:item.actions="{ item }">
            <v-btn rounded small outlined color="info" @click="viewSubject(item)">
              <v-icon small class="mr-2">mdi-magnify</v-icon>View
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-skeleton-loader>
    <add-exam :show="showModal"></add-exam>
  </div>
</template>

<script>
import axios from '@/axios'
import AddExam from './AddExam'

export default {
  data () {
    return {
      search: '',
      showModal: false,
      headers: [
        {
          text: 'Grading Period',
          align: 'start',
          value: 'grading_period'
        },
        { text: 'Subject Name', value: 'subject' },
        { text: 'Exam', value: 'exam_desc' },
        { text: 'Exam Date', value: 'exam_date' },
        { text: 'Assigned Teacher', value: 'teacher_id.name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  components: { AddExam },
  computed: {
    exams () {
      return this.$store.state.exams.list
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      axios
        .get('examination/read-all.php')
        .then(res => {
          let record = res.data.data.exams
          this.$store.commit('exams/setList', record)
          this.$store.commit('loading/show', false)
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
          this.$store.commit('loading/show', false)
        })
    },
    initForStudents () {
      this.$store.commit('loading/show', true)
      let params = {
        student_id: localStorage.getItem('id')
      }
      axios
        .post('examination/read-exams-per-student.php', params)
        .then(res => {
          let record = res.data.data.exams
          this.$store.commit('exams/setList', record)
          this.$store.commit('loading/show', false)
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
          this.$store.commit('loading/show', false)
        })
    },
    initForTeachers () {
      this.$store.commit('loading/show', true)
      let params = {
        teacher_id: localStorage.getItem('id')
      }
      axios
        .post('examination/read-exam-per-teacher.php', params)
        .then(res => {
          let record = res.data.data.exams
          this.$store.commit('exams/setList', record)
          this.$store.commit('loading/show', false)
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.message
          })
          this.$store.commit('loading/show', false)
        })
    },
    openModal () {
      this.showModal = true
    },
    closeModal () {
      this.showModal = false
    },
    viewSubject (item) {
      if (localStorage.getItem('account') == 3) {
        this.$router.push('/exams/' + item.exam_id + '/answer')
        return
      }
      this.$router.push('/exams/' + item.exam_id)
    }
  },
  mounted () {
    switch (localStorage.getItem('account')) {
      case '1':
        this.init()
        break
      case '2':
        this.initForTeachers()
        break
      case '3':
        this.initForStudents()
        break
    }
  }
}
</script>

<style></style>
