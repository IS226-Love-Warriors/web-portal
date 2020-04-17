import axios from 'axios'

export default axios.create({
  baseURL: 'https://protected-atoll-89994.herokuapp.com/api/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
