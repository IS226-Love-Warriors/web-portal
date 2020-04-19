<template>
  <v-skeleton-loader :loading="loading" type="card">
    <div>
      <v-row>
        <v-col align="end">
          <v-btn color="primary" @click="openModal">
            <v-icon class="mr-2">mdi-card-account-details</v-icon>Add Student
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-card-account-details</v-icon>Students
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="students" :search="search">
          <template v-slot:item.actions="{ item }">
            <v-btn rounded small outlined color="info" @click="viewUser(item)">
              <v-icon small class="mr-2">mdi-account-search</v-icon>View
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <add-student :show="showModal"></add-student>
    </div>
  </v-skeleton-loader>
</template>

<script>
import axios from '@/axios'
import AddStudent from './AddStudent'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Student ID',
          align: 'start',
          value: 'id'
        },
        { text: 'First Name', value: 'first_name' },
        { text: 'Last Name', value: 'last_name' },
        { text: 'Email', value: 'email' },
        { text: 'Grade Level', value: 'grade_year_level' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  components: { AddStudent },
  computed: {
    students () {
      return this.$store.state.students.list
    },
    showModal () {
      return this.$store.state.students.showModal
    },
    loading () {
      return this.$store.state.loading.show
    },
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      axios
        .get('user/read-all.php')
        .then(res => {
          let user = res.data.users
          user = user.filter(x => x.account_type == '3')
          this.$store.commit('students/setList', user)
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
      this.$store.commit('students/setShowModal', true)
    },
    viewUser (user) {
      this.$router.push('/students/' + user.id)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style></style>
