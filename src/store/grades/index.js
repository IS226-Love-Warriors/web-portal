import admin from './admin'
import teacher from './teacher'
import student from './student'

let sharedMutations = []

export default {
  strict: true,
  namespaced: true,
  state: Object.assign(admin.state, teacher.state, student.state),
  mutations: Object.assign(
    admin.mutations,
    teacher.mutations,
    student.mutations
  ),
  sharedMutations: sharedMutations
}
