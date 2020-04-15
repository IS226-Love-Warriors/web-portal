import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': 3600,
    'Access-Control-Allow-Headers': 'Origin, X-Auth-Token, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    'Content-Type': 'application/json; charset=UTF-8'
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: true,
})