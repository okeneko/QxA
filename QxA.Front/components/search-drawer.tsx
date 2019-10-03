import React, { useState } from 'react'
import { Drawer, Input, List } from 'antd'
import { anonHttp } from '../http'
import Link from 'next/link'
import Router from 'next/router'

const SearchDrawer = ({ visible, setVisible }) => {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])

  const searchUser = async query => {
    // setQuery(e.target.value)
    if (query.trim() !== '') {
      try {
        const { data } = await anonHttp.get(`auth/search/${query}`)
        setUsers([...data])
      } catch (error) {
        console.error(error.response)
      }
    }
  }

  const goToUser = user => {
    Router.push('/user/[user]', `/user/${user}`)
    closeDrawer()
  }

  const closeDrawer = () => {
    setVisible(false)
    setQuery('')
    setUsers([])
  }

  return (
    <Drawer title="User Search" visible={visible} onClose={() => closeDrawer()}>
      <Input.Search
        value={query}
        onChange={e => setQuery(e.target.value)}
        onSearch={value => searchUser(value)}
      />
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={user => (
          <List.Item onClick={() => goToUser(user)}>
            <a>@{user}</a>
          </List.Item>
        )}
      />
    </Drawer>
  )
}

export default SearchDrawer
