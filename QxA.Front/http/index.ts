import axios from 'axios'
import https from 'https'
import Cookies from 'js-cookie'
import cookie from 'cookie'

const token = Cookies.get('token')
const baseURL = 'https://localhost:5001/api/'

export const http = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${token}` },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

export const anonHttp = axios.create({
  baseURL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

export const tokenHttp = (token: string) => {
  return axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  })
}
