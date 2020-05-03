<template>
  <div>
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate size="100"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="showModal" fullscreen hide-overlay transition="dialog-bottom-transition" v-else>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>View Grade Breakdown</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card-title>
            <v-icon class="mr-2">mdi-format-list-numbered</v-icon>
            {{details.subject_name}}
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="criteria" :search="search">
            <template v-slot:item.actions="{ item }">
              <v-btn rounded small outlined color="info" @click="edit(item)">
                <v-icon small class="mr-2">mdi-pencil</v-icon>Edit
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editModal" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editCriteria.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="editCriteria.score" label="Score"></v-text-field>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditModal" :loading="saving" :disabled="saving">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saving" :disabled="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from '@/axios'

export default {
  name: 'modal-grade',
  props: ['showModal', 'loading'],
  data: () => ({
    search: '',
    editModal: '',
    editCriteria: {
      name: '',
      score: ''
    },
    saving: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        value: 'criteria_name'
      },
      { text: 'Score', value: 'score' },
      { text: 'Percentage', value: 'percentage' },
      { text: 'Score Equivalent', value: 'score_equivalent' },
      { text: 'Actions', value: 'actions', sortable: false }
    ]
  }),
  computed: {
    criteria () {
      return this.$store.state.students.criteria.criteria
    },
    details () {
      return this.$store.state.students.criteria
    }
  },
  methods: {
    closeModal () {
      this.$parent.closeModal()
    },
    edit (item) {
      this.editModal = true
      this.editCriteria.id = item.criteria_id
      this.editCriteria.name = item.criteria_name
      this.editCriteria.score = item.score
    },
    closeEditModal () {
      this.editModal = false
    },
    save () {
      this.saving = true
      let params = {
        criteria_id: this.editCriteria.id,
        score: this.editCriteria.score
      }
      axios
        .post('grades/update-grade.php', params)
        .then(res => {
          this.saving = false
          this.closeEditModal()
          this.$parent.viewBreakdown({ id: this.details.subject_id })
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'success',
            message: res.data.message
          })

        })
        .catch(err => {
          console.log(err)
          this.$store.commit('snackbar/show', true)
          this.$store.commit('snackbar/set', {
            type: 'error',
            message: 'Something went wrong'
          })
          this.saving = false
        })
    }
  }
}
</script>

<style>
</style>