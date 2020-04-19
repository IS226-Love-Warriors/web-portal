<template>
  <div>
    <v-row>
      <v-col align="end" @click="openModal">
        <v-btn color="primary">
          <v-icon class="mr-2">mdi-clipboard-account</v-icon>
          Add Teacher
        </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-clipboard-account</v-icon> Teachers
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="teachers" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn rounded small outlined color="info" @click="viewTeacher(item)">
            <v-icon small class="mr-2">
              mdi-account-search
            </v-icon>
            View
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <add-teacher :show="showModal"></add-teacher>
  </div>
</template>

<script>
import axios from '@/axios'
import AddTeacher from './AddTeacher'

export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Teacher ID',
          align: 'start',
          value: 'id'
        },
        { text: 'First Name', value: 'first_name' },
        { text: 'Last Name', value: 'last_name' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  components: { AddTeacher },
  computed: {
    teachers() {
      return this.$store.state.teachers.list
    },
    showModal() {
      return this.$store.state.teachers.showModal
    }
  },
  methods: {
    init() {
      this.$store.commit('loading/show', true)
      axios
        .get('user/read-all.php')
        .then(res => {
          let teacher = res.data.users
          teacher = teacher.filter(x => x.account_type == '2')
          this.$store.commit('teachers/setList', teacher)
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
    openModal() {
      this.$store.commit('teachers/setShowModal', true)
    },
    viewTeacher(teacher) {
      console.log(teacher)
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style></style>
