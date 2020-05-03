<template>
  <div>
    <v-skeleton-loader :loading="loading" type="card">
      <v-card v-if="isTakeExam">
        <v-card-title class="justify-center">{{ examDetails ? examDetails.exam_text : '' }}</v-card-title>
        <v-card-text class="text-center" v-if="isEnabled()">
          <span v-if="checkDate()">This exam will be available on: {{examDetails.exam_date}}</span>
          <span v-else>This exam was posted on: {{examDetails.exam_date}}. You have not answered this exam.</span>
        </v-card-text>
        <v-card-text class="text-center reminder" v-else>
          <h2>Some reminders before taking the exam:</h2>
          <p class="mt-6">1. Don't refresh the page</p>
          <p>2. Any form of cheating would automatically lead to 0 in this exam and failure in this subject.</p>
          <p>3. Don't leave any question unanswered. Better take a guess than leaving it blank.</p>
          <p>4. When you don't know the answer, just pray.</p>
        </v-card-text>
        <v-card-actions class="justify-center my-5">
          <v-btn x-large color="primary" :disabled="isEnabled()" @click="takeExam">Take Exam</v-btn>
        </v-card-actions>
      </v-card>

      <div v-else-if="isTakeExam == 0 && hitRefresh">
        <v-btn large color="grey" text class="pa-0 mb-4" @click="back">
          <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>Back
        </v-btn>
        <v-alert type="error">You hit refresh. Your exam is invalid.</v-alert>
      </div>

      <v-card v-else>
        <v-row>
          <v-col cols="12" sm="12" md="4" class="px-6">
            <v-container>
              <p>
                You only have
                <strong>{{countDown}} seconds</strong>
                <br />to finish the exam.
              </p>
            </v-container>
            <v-container class="grey lighten-5">
              <v-row>
                <template v-for="(exam, n) in questionNo">
                  <v-col :key="n+1" style="min-width: 50px; max-width:50px; margin:10px;" class="pa-0">
                    <v-card class="pa-3 text-center" outlined tile :color="exam.val ? 'primary' : ''">{{n+1}}</v-card>
                  </v-col>
                </template>
              </v-row>
            </v-container>
            <v-container class="d-flex justify-center">
              <v-btn x-large color="primary" :disabled="questionNo.length != answers.length" @click="submitExam">SUBMIT</v-btn>
            </v-container>
          </v-col>
          <v-col cols="12" sm="12" md="8">
            <v-container v-for="(exam, i) in exams" :key="exam.question_id" class="px-11">
              <v-card>
                <v-card-title>{{i+1}}. {{exam.question_text}}</v-card-title>
                <v-card-text>
                  <v-radio-group>
                    <v-radio
                      v-for="(choice, k) in exam.choices"
                      :key="k"
                      :label="choice.choice_text"
                      @change="getAnswers(exam.question_id, choice.choice_text, k+1)"
                    ></v-radio>
                  </v-radio-group>
                </v-card-text>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'answer-exam',

  data () {
    return {
      id: '',
      hitRefresh: false,
      answers: [],
      questionNo: [],
      countDown: 10,
      isTakeExam: parseInt(localStorage.getItem(this.id))
    }
  },
  computed: {
    loading () { return this.$store.state.loading.show },
    examDetails () {
      return this.$store.state.exams.item.exam_details
    },
    exams () {
      return this.$store.state.exams.item.records
    },
    currentDate () {
      return new Date().toISOString().substr(0, 10)
    }
  },
  watch: {
    countDown: {
      handler (value) {

        if (value > 0) {
          setTimeout(() => {
            this.countDown--
          }, 1000);
        }

        if (value == 0) {
          alert("Time's up! Your exam will be submitted.")
          this.submitExam()
        }

      }
    }
  },
  methods: {
    isEnabled () {
      if (this.examDetails) {
        return this.currentDate != this.examDetails.exam_date
      }
      return false
    },
    checkDate () {
      let examDate = new Date(this.examDetails.exam_date).toISOString().substr(0, 10)
      console.log(examDate > this.currentDate, examDate, this.currentDate)
      return examDate > this.currentDate
    },
    back () {
      this.$router.push('/exams')
    },
    async getAnswers (question, answer, seq) {
      let answerBody = {
        question_id: question,
        seq_no: seq,
        stud_answer_text: answer
      }
      this.answers = this.answers.filter((x) => {
        return x.question_id !== question
      })
      this.answers.push(answerBody)

      this.questionNo.forEach((x) => {
        if (x.id == question) {
          x.val = true
        }
      })
      await this.$nextTick()
    },
    submitExam () {
      this.$store.commit('loading/show', true)
      let id = window.location.pathname.split('/')[2]
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        student_id: user.id,
        exam_id: id,
        answers: this.answers,
      }
      axios
        .post('result/create.php', params)
        .then(res => {
          if (res.data.message) {
            this.$store.commit('loading/show', false)
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'success',
              message: res.data.message
            })
            this.$router.push('/exams/' + this.id + '/view-answer')
            this.isTakeExam = 1
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
    takeExam () {
      localStorage.setItem(this.id, 0)
      this.isTakeExam = 0
      this.countDown = this.exams.length * 20
    },
    init () {
      this.$store.commit('loading/show', true)

      let id = window.location.pathname.split('/')[2]
      this.id = id
      let user = JSON.parse(localStorage.getItem('user'))
      let studentId = user.id
      id = {
        exam_id: id,
        student_id: studentId
      }
      axios
        .post('answer/read-choices.php', id)
        .then(res => {
          if (res.data) {
            if (res.data.data.score != undefined) {
              this.$store.commit('loading/show', false)
              this.$router.push('/exams/' + this.id + '/view-answer')
            } else {

              let exam = res.data.data
              this.$store.commit('exams/setItem', exam)
              let question = exam.records.map((x) => ({
                id: x.question_id,
                val: false
              }))
              this.questionNo = question
              this.$store.commit('loading/show', false)
            }
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
    if (localStorage.getItem(this.id) == null) {
      localStorage.setItem(this.id, 1)
      this.isTakeExam = 1
    } else {
      this.isTakeExam = parseInt(localStorage.getItem(this.id))
      if (!this.isTakeExam) {
        this.hitRefresh = true
      }
    }
  },
  destroyed () {
    this.isTakeExam = 1
    localStorage.removeItem(this.id)
  }

}
</script>

<style lang="scss" scoped>
.reminder {
  border: 1px solid #dcdcdc;
  padding: 50px;
  max-width: 570px;
  margin: 0 auto;
}
</style>