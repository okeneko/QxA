import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import { http } from '../http'
import { Layout as AntLayout } from 'antd'
import { Store } from '../store'
import LoginMenu from './login-menu'
import LoggedMenu from './logged-menu'
import IUser from '../interfaces/IUser'

const { Header, Content } = AntLayout

const Layout = ({ children }) => {
  const { user, dispatch } = useContext(Store)
  const token = Cookies.get('token')

  const getUser = async () => {
    const { nameid } = jwtDecode(token)
    const { data } = await http.get(`auth/${nameid}`)

    const user: IUser = {
      username: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      token: token
    }

    dispatch({
      type: 'LOGIN',
      payload: user
    })
  }

  useEffect(() => {
    if (!!token && user.token === '') {
      getUser()
    }
  }, [user])

  return (
    <AntLayout className="layout">
      <Header className="header">
        <Link href="/">
          <a className="header__title">QxA</a>
        </Link>
        {user.token === '' ? <LoginMenu /> : <LoggedMenu />}
      </Header>
      <Content className="content">{children}</Content>
    </AntLayout>
  )
}

export default Layout
