<template>
  <div>
    <v-row>
      <v-col align="end">
        <v-btn color="primary" @click="openModal">
          <v-icon class="mr-2">mdi-account-cog</v-icon>Add Admin
        </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-account-cog</v-icon>Admins
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="admins" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn rounded small outlined color="info" @click="viewUser(item)">
            <v-icon small class="mr-2">mdi-account-search</v-icon>View
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <add-admin :show="showModal"></add-admin>
  </div>
</template>

<script>
import axios from '@/axios'
import AddAdmin from './AddAdmin'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Admin ID',
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
  components: { AddAdmin },
  computed: {
    admins () {
      return this.$store.state.admins.list
    },
    showModal () {
      return this.$store.state.admins.showModal
    }
  },
  methods: {
    init () {
      this.$store.commit('loading/show', true)
      axios
        .get('user/read-all.php')
        .then(res => {
          let user = res.data.users
          user = user.filter(x => x.account_type == '1')
          this.$store.commit('admins/setList', user)
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
      this.$store.commit('admins/setShowModal', true)
    },
    viewUser (user) {
      this.$router.push('/admins/' + user.id)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style></style>
