import React from 'react'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import Link from 'next/link'

const LoginMenu = () => {
  const { pathname } = useRouter()

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname.substring(1)]}
      className="menu">
      <Menu.Item key="login">
        <Link href="/login">
          <a>Log In</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link href="/register">
          <a>Register</a>
        </Link>
      </Menu.Item>
    </Menu>
  )
}

export default LoginMenu
