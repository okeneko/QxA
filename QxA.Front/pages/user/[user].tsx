import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { Store } from '../../store'
import Router from 'next/router'
import IUser from '../../interfaces/IUser'
import https from 'https'
import DevAlert from '../../components/dev-alert'

const User = ({ profile }) => {
  const { user } = useContext(Store)

  return (
    <section className="profile">
      <DevAlert />
      {!profile ? (
        <h1>issa error m8</h1>
      ) : (
        <>
          <h1>@{profile.username}</h1>
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>
        </>
      )}
    </section>
  )
}

User.getInitialProps = async ({ query: { user } }) => {
  try {
    const { data } = await axios.get(
      `https://localhost:5001/api/auth/${user}`,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      }
    )

    const profileUser: IUser = {
      username: data.userName,
      firstName: data.firstName,
      lastName: data.lastName
    }
    return {
      profile: profileUser
    }
  } catch (error) {
    console.log(error)
  }

  return {}

  // let username = ''
  // if (req) {
  //   console.log('req', query)

  //   username = req.url.substring(1)
  // } else {
  //   const { user } = Router.query
  //   // console.log(user)
  // }
  // return {}
  // // return { username }
}

export default User
