<template>
  <div>
    <v-skeleton-loader :loading="loading" type="article">
      <v-col class="pt-0 pb-1 d-flex justify-space-between">
        <v-btn large color="grey" text class="pa-0" @click="back">
          <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
        </v-btn>
      </v-col>
      <v-card>
        <v-card-title class="justify-center">{{exam.exam_desc}}</v-card-title>
        <v-card-text class="text-center">
          Score:
          <strong>{{exam.score}}</strong>
          <br />Percentage:
          <strong>{{exam.percentage}}</strong>
        </v-card-text>

        <v-container v-for="(item,i) in result" :key="i">
          <v-card>
            <v-card-title>{{item.question_text}}</v-card-title>
            <v-card-text>
              <v-alert :type="parseInt(item.is_correct) ? 'success' : 'error'">{{item.stud_answer_text}}</v-alert>
              <v-alert dense text type="success" v-if="!parseInt(item.is_correct)">
                <strong>Correct Answer:</strong>
                {{item.correct_answer_text}}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'view-answer',
  data () {
    return {}
  },
  computed: {
    loading () {
      return this.$store.state.loading.show
    },
    exam () {
      return this.$store.state.exams.result
    },
    result () {
      return this.$store.state.exams.result.exam_details
    }
  },
  methods: {
    back () {
      this.$router.push('/exams')
    },
    init () {
      this.$store.commit('loading/show', true)

      let exam_id = window.location.pathname.split('/')[2]
      let student_id = JSON.parse(localStorage.getItem('user')).id
      let params = {
        exam_id, student_id
      }
      axios
        .post('result/read-one.php', params)
        .then(res => {
          if (res.data) {
            this.$store.commit('exams/setResult', res.data.data)
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
          this.$router.push('/exams')
        })
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style>
</style>