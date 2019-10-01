import React from 'react'
import cookie from 'cookie'
import jwtDecode from 'jwt-decode'
import http from '../http'
import Home from '../components/home'
import Dashboard from '../components/dashboard'

const Index = ({ logged, questions }) =>
  logged ? <Dashboard dashboardQuestions={questions} /> : <Home />

Index.getInitialProps = async ({ req }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || '' : document.cookie
  )

  let questions = []

  if (!!token) {
    const { nameid } = jwtDecode(token)
    try {
      const { data } = await http.get(`questions/${nameid}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      questions = [...data]
    } catch (error) {
      console.error(error.response)
    }
  }

  return { logged: !!token, questions }
}

export default Index
