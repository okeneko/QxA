import axios from 'axios'
import https from 'https'
import Cookies from 'js-cookie'

const token = Cookies.get('token')

const http = axios.create({
  baseURL: 'https://localhost:5001/api/',
  headers: { Authorization: `Bearer ${token}` },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

export default http
