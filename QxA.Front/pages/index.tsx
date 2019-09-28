import React, { useContext, useEffect } from 'react'
import { Store } from '../store'
import IUser from '../interfaces/IUser'
import axios from 'axios'
import Link from 'next/link'
import DevAlert from '../components/dev-alert'

const Index = () => {
  const { user, dispatch } = useContext(Store)
  return (
    <div>
      <DevAlert />
      <h1>hellooooo</h1>
      {user.token !== '' && <h2>Welcome miss {user.firstName}</h2>}
    </div>
  )
}

export default Index
