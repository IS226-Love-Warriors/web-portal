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
              <v-list-item
                v-for="(item, index) in menu"
                :key="index"
                @click="clickedMenu(item)"
                :disabled="checkDisplayMenu(item.value)"
              >
                <v-list-item-title>
                  <v-icon class="mr-1" small>mdi-{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-card v-if="!showQuestionForm">
        <v-card-title>{{ examDetails ? examDetails.exam_text : '' }}</v-card-title>
        <v-card-text>Date of Exam: {{examDetails ? examDetails.exam_date : ''}}</v-card-text>
      </v-card>
      <v-container class="py-10">
        <div v-if="exams.length > 0">
          <v-container v-for="(exam, i) in exams" :key="exam.question_id" class="px-11">
            <v-card>
              <v-card-title>{{i+1}}. {{exam.question_text}}</v-card-title>
              <v-card-text
                v-for="(choice, i) in exam.choices"
                :key="i"
              >{{String.fromCharCode('A'.charCodeAt() + i)}}. {{choice.choice_text}}</v-card-text>
            </v-card>
          </v-container>
        </div>

        <div v-else-if="exams.length <=0 && !showQuestionForm">
          <v-container>
            <v-alert prominent type="error">
              <v-row align="center">
                <v-col class="grow">Please create a questionnaire</v-col>
                <v-col class="shrink">
                  <v-btn @click="createExam">Create</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-container>
        </div>

        <div v-else-if="showQuestionForm">
          <v-row>
            <v-col cols="12" sm="12" md="6">
              <v-container>
                <v-card color="light-blue lighten-5" class="px-8 py-5" elevation="5" style="max-width: 700px;">
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          label="Question?"
                          outlined
                          hide-details
                          required
                          v-model="question_text"
                          :rules="[v => !!v ]"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field label="A" outlined hide-details required v-model="answer_text[0]" :rules="[v => !!v ]"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="6">
                        <v-text-field label="C" outlined hide-details required v-model="answer_text[2]" :rules="[v => !!v ]"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field label="B" outlined hide-details required v-model="answer_text[1]" :rules="[v => !!v ]"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="6">
                        <v-text-field label="D" outlined hide-details required v-model="answer_text[3]" :rules="[v => !!v ]"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items="choices"
                          label="Correct Answer"
                          item-text="letter"
                          item-value="value"
                          required
                          v-model="correctAnswer"
                          :rules="[v => !!v ]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="8" class="d-flex justify-end">
                        <v-btn color="primary" large class="mr-3" @click="addMore">Add More</v-btn>
                        <v-btn color="success" large @click="save" :disabled="!questionSets.length">Save</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card>
              </v-container>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-container v-for="(question,i) in questionSets" :key="i">
                <v-card>
                  <v-card-title>{{i+1}}. {{question.question_name}}</v-card-title>
                  <v-card-text
                    v-for="(choice, i) in question.choices"
                    :key="i"
                  >{{String.fromCharCode('A'.charCodeAt() + i)}}. {{choice.text}}</v-card-text>
                  <v-card-text>
                    Answer:
                    <strong>{{String.fromCharCode('A'.charCodeAt() + question.answer-1)}}</strong>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-skeleton-loader>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'exam-details',
  data () {
    return {
      menu: [
        { title: 'Create Exam', value: 'createExam', icon: 'clipboard-check-multiple' },
        { title: 'Add Student', value: 'addStudent', icon: 'card-account-details' }
      ],
      choices: [
        { letter: 'A', value: 1 },
        { letter: 'B', value: 2 },
        { letter: 'C', value: 3 },
        { letter: 'D', value: 4 },
      ],
      showQuestionForm: false,
      id: '',
      question_text: '',
      answer_text: [],
      correctAnswer: 0,
      questionSets: []
    }
  },
  computed: {
    examDetails () {
      return this.$store.state.exams.item.exam_details
    },
    exams () {
      return this.$store.state.exams.item.records
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    back () {
      if (this.showQuestionForm) {
        this.showQuestionForm = false
        return
      }
      this.$router.push('/exams')
    },
    clickedMenu (item) {
      switch (item.value) {
        case 'createExam':
          this.showQuestionForm = true
          break
        case 'addStudent': console.log('addstudent')
      }
    },
    checkDisplayMenu (item) {
      if (item == 'createExam') {
        if (this.exams.length > 0) {
          return true
        }
      }
      return false
    },
    createExam () {
      this.showQuestionForm = true
    },
    addMore () {
      if (!this.$refs.form.validate()) {
        this.$store.commit('loading/show', false)
        return
      }
      let answers = this.answer_text.map((x, i) => ({
        key: i + 1, text: x
      }))
      let question = {
        question_name: this.question_text,
        choices: answers,
        answer: this.correctAnswer
      }
      this.questionSets.push(question)
      this.$store.commit('snackbar/show', true)
      this.$store.commit('snackbar/set', {
        type: 'success',
        message: 'Question: ' + this.question_text + ' was created'
      })
      this.$refs.form.reset()
    },
    save () {
      this.$store.commit('loading/show', true)
      if (this.$refs.form.validate()) {
        this.addMore()
      }

      let params = {
        exam_id: this.id,
        question_type: "multiple",
        questions: this.questionSets
      }
      axios
        .post('question/create.php', params)
        .then(res => {
          if (res.data) {
            this.$store.commit('snackbar/show', true)
            this.$store.commit('snackbar/set', {
              type: 'success',
              message: res.data.message
            })
            this.$store.commit('loading/show', false)
            this.$router.push('/exams/' + this.id)
            this.init()
            this.showQuestionForm = false
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
    init () {
      this.$store.commit('loading/show', true)

      let id = window.location.pathname.split('/')[2]
      this.id = id
      id = { exam_id: id }
      axios
        .post('answer/read-choices.php', id)
        .then(res => {
          if (res.data) {
            this.$store.commit('exams/setItem', res.data.data)
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
