import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { Menu, Icon } from 'antd'
import { Store } from '../store'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'

const { SubMenu } = Menu

const LoggedMenu = () => {
  const { pathname } = useRouter()
  const { user, dispatch } = useContext(Store)

  const logout = () => {
    Cookies.remove('token')
    dispatch({
      type: 'LOGOUT'
    })
    Router.push('/')
  }

  const getPath = (): string => {
    if (pathname === '/') return 'home'
    if (pathname === '/settings') return 'settings'
    if (pathname.substring(0, 6) === '/user/') return 'user'
    return pathname
  }

  return (
    <Menu mode="horizontal" className="menu" selectedKeys={[getPath()]}>
      <Menu.Item key="home">
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
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
          <span>
            <Icon type="logout" />
            Log Out
          </span>
        </Menu.Item>
      </SubMenu>
    </Menu>
  )
}

export default LoggedMenu
