<template>
  <div>
    <v-skeleton-loader :loading="loading" type="card">
      <v-row v-show="accountType">
        <v-col align="end" class="pt-1">
          <v-btn color="primary" @click="openModal">
            <v-icon class="mr-2">mdi-bookshelf</v-icon>Add Subject
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-bookshelf</v-icon>Subjects
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>

        <v-data-table :headers="headers" :items="subjects" :search="search">
          <template #item.grade_level="{ item }">{{ item.grade_year }} ({{ item.level }})</template>
          <template v-slot:item.actions="{ item }">
            <v-btn rounded small outlined color="info" @click="viewSubject(item)">
              <v-icon small class="mr-2">mdi-magnify</v-icon>View
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-skeleton-loader>
    <add-subject :show="showModal"></add-subject>
  </div>
</template>

<script>
import axios from '@/axios'
import AddSubject from './AddSubject'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Subject ID',
          align: 'start',
          value: 'subject_id'
        },
        { text: 'Subject Name', value: 'subject_name' },
        { text: 'Grade Level', value: 'grade_level' },
        { text: 'Academic Year', value: 'acad_year' },
        { text: 'Assigned Teacher', value: 'assigned_teacher.name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  components: { AddSubject },
  computed: {
    subjects () {
      return this.$store.state.subjects.list
    },
    showModal () {
      return this.$store.state.subjects.showModal
    },
    loading () {
      return this.$store.state.loading.show
    },
    accountType () {
      let acct = localStorage.getItem('account')
      if (acct == '1') {
        return true
      }
      return false
    }
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      axios
        .get('subject/read-all.php')
        .then(res => {
          let record = res.data.data.records
          this.$store.commit('subjects/setList', record)
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
        grade_year: JSON.parse(localStorage.getItem('user')).grade_level
      }
      axios
        .post('subject/read-subject-level.php', params)
        .then(res => {
          let record = res.data.data.records
          this.$store.commit('subjects/setList', record)
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
        .post('subject/read-teacher-subject.php', params)
        .then(res => {
          let record = res.data.data.records
          this.$store.commit('subjects/setList', record)
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
      this.$store.commit('subjects/setShowModal', true)
    },
    viewSubject (item) {
      this.$router.push('/subjects/' + item.subject_id)
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
