<template>
  <div>
    <v-card>
      <v-tabs dark background-color="primary" center-active show-arrows grow v-model="tab">
        <v-tab v-for="i in 12" :key="i" :disabled="loading">
          <v-icon left>mdi-format-list-numbered</v-icon>
          Grade {{ i }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="i in 12" :key="i">
          <v-skeleton-loader :loading="loading" type="article">
            <v-card flat>
              <v-card-title>
                <v-icon class="mr-2">mdi-format-list-numbered</v-icon>
                Grade {{i}} Students
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
              </v-card-title>

              <v-data-table :headers="headers" :items="grades" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-btn rounded small outlined color="info" @click="viewGrade(item)">
                    <v-icon small class="mr-2">mdi-magnify</v-icon>View
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-skeleton-loader>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  data: () => ({
    search: '',
    tab: 0,
    headers: [
      {
        text: 'Student ID',
        align: 'start',
        value: 'student_id'
      },
      { text: 'Student Name', value: 'name' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
  }),
  watch: {
    tab () {
      this.init()
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading.show
    },
    grades () { return this.$store.state.grades.admin.list }
  },
  methods: {
    init () {
      if (this.loading) { return }
      this.$store.commit('loading/show', true)
      let params = {
        grade_year_level: 'Grade ' + (this.tab + 1)
      }
      axios
        .post('grades/read-grade-admin.php', params)
        .then(res => {
          this.$store.commit('grades/setAdminList', res.data.data)
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'success',
            message: res.data.message
          })
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
    viewGrade (item) {
      this.$router.push('/students/' + item.student_id + '/grades')
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style>
</style>