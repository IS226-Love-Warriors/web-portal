<template>
  <div>
    <v-skeleton-loader :loading="loading" type="article">
      <v-col class="pt-0 pb-1 d-flex justify-space-between">
        <v-btn large color="grey" text class="pa-0" @click="back">
          <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
        </v-btn>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn fab dark small color="primary" v-on="on">
                <v-icon dark>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in menu" :key="index" @click="clickedMenu(item)">
                <v-list-item-title>
                  <v-icon class="mr-1" small>mdi-{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-card>
        <v-card-title>{{ subject.subject_name }}</v-card-title>
        <v-card-text class="py-0">
          <strong>{{ subject.assigned_teacher ? subject.assigned_teacher.name : subject.assigned_teacher }}</strong>
        </v-card-text>
        <v-card-text class="py-0">{{ subject.grade_year }} ({{ subject.level }})</v-card-text>
        <v-card-text class="pt-0">A.Y. {{ subject.acad_year }}</v-card-text>
      </v-card>
    </v-skeleton-loader>
    <create-exam :show="showCreateExamModal" :id="id"></create-exam>
  </div>
</template>

<script>
import axios from '@/axios'
import CreateExam from './CreateExam'

export default {
  name: 'subject-profile',
  components: { CreateExam },
  data () {
    return {
      menu: [
        { title: 'Create Exam', value: 'createExam', icon: 'clipboard-check-multiple' },
        { title: 'Add Student', value: 'addStudent', icon: 'card-account-details' }
      ],
      showCreateExamModal: false,
      id: ''
    }
  },
  computed: {
    subject () {
      return this.$store.state.subjects.item
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    back () {
      this.$router.push('/subjects')
    },
    clickedMenu (item) {
      switch (item.value) {
        case 'createExam':
          this.showCreateExamModal = true
          break
        case 'addStudent': console.log('addstudent')
      }
    },
    closeModal () {
      this.showCreateExamModal = false
    }
  },
  mounted () {
    this.$store.commit('loading/show', true)

    let id = window.location.pathname.split('/')[2]
    this.id = id
    id = { subject_id: id }
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
        this.$router.push('/subjects')
      })
  }
}
</script>

<style></style>
