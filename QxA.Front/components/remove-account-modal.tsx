import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Modal, Typography, Form, Input, message } from 'antd'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Store } from '../store'
const { Title } = Typography

const RemoveAccountModal = ({ modalVisible, setVisible }) => {
  const { user, dispatch } = useContext(Store)
  const [password, setPassword] = useState('')
  const [passwordValidated, setPasswordValidated] = useState(true)
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const yesModal = async () => {
    if (password === '') {
      setPasswordValidated(false)
      setPasswordError('Password cannot be empty.')
    } else {
      setPasswordValidated(true)
      setPasswordError('')
      setLoading(true)
      try {
        await axios.post(
          'https://localhost:5001/api/auth/authorize',
          {
            username: user.username,
            password: password
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )

        await axios.delete(`https://localhost:5001/api/auth/${user.username}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })

        Cookies.remove('token')
        dispatch({
          type: 'LOGOUT'
        })

        setLoading(false)
        setPassword('')
        setVisible(false)
        message.success('The account was successfully removed.', 5)
        Router.push('/')
      } catch (error) {
        if (
          !!error.response &&
          error.response.status === 401 &&
          error.response.config.method === 'post'
        ) {
          setLoading(false)
          setPasswordValidated(false)
          setPasswordError('The password is wrong.')
        } else {
          message.error(
            "An error occurred, the account couldn't be removed. Try again after a couple of minutes.",
            8
          )
          setLoading(false)
          setPassword('')
          setVisible(false)
        }
      }
    }
  }

  const noModal = () => {
    console.log('no')
    setVisible(false)
  }

  return (
    <Modal
      visible={modalVisible}
      onOk={() => yesModal()}
      okText="Yes"
      okButtonProps={{ type: 'danger', loading }}
      onCancel={() => noModal()}
      cancelText="No"
      cancelButtonProps={{ type: 'link', disabled: loading }}
      maskClosable={false}>
      <Typography>
        <Title level={3}>Are you sure you want to remove your account?</Title>
        Insert your password to verify it's really you.
        <Form.Item
          validateStatus={passwordValidated ? '' : 'error'}
          help={passwordError}>
          <Input.Password
            placeholder="Insert your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
      </Typography>
    </Modal>
  )
}

export default RemoveAccountModal
