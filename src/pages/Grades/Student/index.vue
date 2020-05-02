<template>
  <div>
    <v-skeleton-loader :loading="loading" type="article">
      <v-card>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Subject Name</th>
                <th class="text-left">Assigned Teacher</th>
                <th class="text-center">1</th>
                <th class="text-center">2</th>
                <th class="text-center">3</th>
                <th class="text-center">4</th>
                <th class="text-center">Final Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in grades" :key="item.id" class="stylehover">
                <td>{{ item.subject }}</td>
                <td>{{ item.teacher }}</td>
                <td class="text-center font-weight-bold">{{ item.first }}</td>
                <td class="text-center font-weight-bold">{{ item.second }}</td>
                <td class="text-center font-weight-bold">{{ item.third }}</td>
                <td class="text-center font-weight-bold">{{ item.fourth }}</td>
                <td class="text-center font-weight-bold">{{ item.final }}</td>
                <td class="text-center">
                  <v-btn
                    class="mr-2"
                    outlined
                    rounded
                    small
                    color="primary"
                    @click="viewBreakdown(item)"
                    :disabled="loading"
                  >
                    <v-icon left small>mdi-magnify</v-icon>View
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-skeleton-loader>
    <modal-grade :showModal="showModal" :loading="loadingCriteria"></modal-grade>
  </div>
</template>

<script>
import axios from '@/axios'
import ModalGrade from './ModalGrade'

export default {
  data: () => ({
    showModal: false,
    loadingCriteria: false
  }),
  components: { ModalGrade },
  computed: {
    grades () { return this.$store.state.students.grades },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      let id = localStorage.getItem('id')
      id = { student_id: id }
      axios
        .post('grades/read-grade-student.php', id)
        .then(res => {
          if (res.data) {
            let grades = this.formatData(res.data.data)
            this.$store.commit('students/setGrades', grades)
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
          this.$router.push('/students')
        })
    },

    formatData (data) {
      let grades = data.grades
      let displayGrades = []

      grades.forEach((grade) => {
        let exist = displayGrades.filter((subj) => {
          return subj.id == grade.subject_id
        })

        if (exist.length) {
          switch (grade.grading_period) {
            case '1':
              exist[0].first = grade.grade
              break
            case '2':
              exist[0].second = grade.grade
              break
            case '3':
              exist[0].third = grade.grade
              break
            case '4':
              exist[0].fourth = grade.grade
              break
          }
        } else {
          let period = {
            first: '',
            second: '',
            third: '',
            fourth: '',
            final: ''
          }
          switch (grade.grading_period) {
            case '1':
              period.first = grade.grade
              break
            case '2':
              period.second = grade.grade
              break
            case '3':
              period.third = grade.grade
              break
            case '4':
              period.fourth = grade.grade
              break
          }
          let item = {
            id: grade.subject_id,
            subject: grade.subject_name,
            teacher: grade.teacher,
            ...period
          }
          displayGrades.push(item)
        }

      })

      return displayGrades
    },
    viewBreakdown (item) {
      this.showModal = true
      this.loadingCriteria = true
      let id = localStorage.getItem('id')
      let params = {
        student_id: id,
        subject_id: item.id
      }
      axios
        .post('grades/read-grade-breakdown.php', params)
        .then(res => {
          if (res.data) {
            this.$store.commit('students/setCriteria', res.data.data)
            this.loadingCriteria = false
          }
        })
        .catch(err => {
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: err.response.data.message
          })
          this.loadingCriteria = false
          this.showModal = false
        })
    },
    closeModal () {
      this.showModal = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
td,
th {
  border: thin solid rgba(0, 0, 0, 0.08);
}
.stylehover {
  cursor: pointer;

  &:hover {
    background-color: lightyellow !important;
  }
}
</style>