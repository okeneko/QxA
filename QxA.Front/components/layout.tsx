import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import { http } from '../http'
import { Layout as AntLayout, Button, Menu, Icon } from 'antd'
import { Store } from '../store'
import IUser from '../interfaces/IUser'
import Router, { useRouter } from 'next/router'
import SearchDrawer from './search-drawer'

const { Header, Content } = AntLayout
const { SubMenu } = Menu

const Layout = ({ children }) => {
  const { user, dispatch } = useContext(Store)
  const { pathname } = useRouter()
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

  const logout = () => {
    dispatch({
      type: 'LOGOUT'
    })
    Router.push('/')
  }

  useEffect(() => {
    if (!!token && user.token === '') {
      getUser()
    }
  }, [user])

  const getPath = (): string => {
    if (pathname === '/') return 'home'
    if (pathname.substring(0, 6) === '/user/') return 'user'
    return pathname.substring(1)
  }

  const [searchVisible, setSearchVisible] = useState(false)

  return (
    <>
      <AntLayout className="layout">
        <Header className="header">
          <Link href="/">
            <a className="header__title">QxA</a>
          </Link>
          <Menu mode="horizontal" className="menu" selectedKeys={[getPath()]}>
            {user.token === '' && (
              <Menu.Item key="login">
                <Link href="/login">
                  <a>Log In</a>
                </Link>
              </Menu.Item>
            )}
            {user.token === '' && (
              <Menu.Item key="register">
                <Link href="/register">
                  <a>Register</a>
                </Link>
              </Menu.Item>
            )}
            {user.token !== '' && (
              <Menu.Item key="home">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </Menu.Item>
            )}
            {user.token !== '' && (
              <SubMenu key="user" title={`${user.firstName} ${user.lastName}`}>
                <Menu.Item key="user">
                  <Link href="/user/[user]" as={`/user/${user.username}`}>
                    <a>
                      <Icon type="user" />
                      Profile
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="settings">
                  <Link href="/settings">
                    <a>
                      <Icon type="setting" />
                      Settings
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="logout" onClick={() => logout()}>
                  <>
                    <Icon type="logout" />
                    Log Out
                  </>
                </Menu.Item>
              </SubMenu>
            )}

            <Menu.Item key="search" onClick={() => setSearchVisible(true)}>
              <Icon type="search" style={{ margin: 0 }} />
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="content">{children}</Content>
      </AntLayout>
      <SearchDrawer visible={searchVisible} setVisible={setSearchVisible} />
    </>
  )
}

export default Layout
