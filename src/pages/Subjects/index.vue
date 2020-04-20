<template>
  <div>
    <v-skeleton-loader :loading="loading" type="card">
      <v-row>
        <v-col align="end">
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
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      axios
        .get('subject/read-all.php')
        .then(res => {
          let record = res.data.records
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
      // this.$router.push('/subjects/' + item.subject_id)
      alert('Not working yet. No view page for ' + item.subject_name)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style></style>
