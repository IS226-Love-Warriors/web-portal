<template>
  <v-skeleton-loader :loading="loading" type="article">
    <div>
      <v-btn large color="grey" text class="pa-0" @click="back">
        <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
      </v-btn>
      <v-card class="d-flex">
        <div class="pa-4 pr-0">
          <v-avatar color="primary" size="52">
            <span class="white--text headline">{{firstLetter(teacher.name)}}</span>
          </v-avatar>
        </div>
        <div>
          <v-card-title class="pb-1">{{ teacher.name }}</v-card-title>
          <v-card-text>{{ teacher.email }}</v-card-text>
        </div>
      </v-card>

      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-bookshelf</v-icon>Assigned Subjects
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>

        <v-data-table :headers="headers" :items="subjects" :search="search">
          <template #item.grade_level="{ item }">{{ item.grade_year }} ({{ item.level }})</template>
        </v-data-table>
      </v-card>
    </div>
  </v-skeleton-loader>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'teacher-profile',
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
        { text: 'Academic Year', value: 'acad_year' }
      ]
    }
  },
  computed: {
    teacher () {
      return this.$store.state.teachers.profile
    },
    subjects () {
      return this.$store.state.subjects.list
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    back () {
      this.$router.push('/teachers')
    },
    firstLetter (name) {
      if (!name) { return }
      let initials = name.split(' ')
      initials = initials[0][0] + initials[initials.length - 1][0]
      return initials
    },
    getTeacher () {
      this.$store.commit('loading/show', true)

      let id = window.location.pathname.split('/')[2]
      id = { teacher_id: id }
      axios
        .post('subject/read-teacher-subject.php', id)
        .then(res => {
          if (res.data) {
            this.$store.commit('teachers/setProfile', res.data.data.assigned_teacher)
            this.$store.commit('subjects/setList', res.data.data.records)
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
          this.$router.push('/teachers')
        })
    }
  },
  mounted () {
    this.getTeacher()
  }
}
</script>

<style></style>
