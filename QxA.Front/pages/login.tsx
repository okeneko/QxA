import React, { useState, useContext, useEffect } from 'react'
import { Card, Form, Input, Button, Icon, Row, Col } from 'antd'
import http from '../http'
import Cookies from 'js-cookie'
import cookie from 'cookie'
import { Store } from '../store'
import Router from 'next/router'

const LoginForm = ({ form }): JSX.Element => {
  const { dispatch } = useContext(Store)
  const { getFieldDecorator, validateFields, getFieldValue, resetFields } = form
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateFields(async (error, values) => {
      if (!error) {
        setLoading(true)
        try {
          const { data } = await http.post('auth/login', {
            username: values.username.trim(),
            password: values.password
          })

          Cookies.set('token', data.token)

          dispatch({
            type: 'LOGIN',
            payload: data
          })

          setLoginError('')
          setLoading(false)
          resetFields()

          Router.push('/')
        } catch (error) {
          setLoading(false)
          setLoginError('Username or password are wrong.')
        }
      }
    })
  }

  return (
    <Form onSubmit={submit} className="form">
      <Form.Item validateStatus="error" help={loginError}></Form.Item>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [
            { required: true, message: 'Username cannot be empty.' },
            { whitespace: true, message: 'Username cannot be empty.' }
          ]
        })(
          <Input
            prefix={<Icon type="user" />}
            placeholder="Username"
            allowClear
            className="input"
            disabled={loading}
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Password cannot be empty.' }]
        })(
          <Input.Password
            prefix={<Icon type="lock" />}
            placeholder="Password"
            allowClear
            className="input"
            disabled={loading}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Log In
        </Button>
      </Form.Item>
    </Form>
  )
}

const Login = (): JSX.Element => {
  const CreatedLoginForm = Form.create({ name: 'login_form' })(LoginForm)
  return (
    <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
      <Col xs={24} md={12} lg={8}>
        <Card
          title="Log In"
          bordered={false}
          headStyle={{ textAlign: 'center' }}>
          <CreatedLoginForm />
        </Card>
      </Col>
    </Row>
  )
}

Login.getInitialProps = async ({ req, res }) => {
  const { token } = cookie.parse(
    req ? req.headers.cookie || '' : document.cookie
  )

  if (!!token) {
    if (req) {
      res.writeHead(302, {
        Location: '/'
      })
      res.end()
    } else Router.push('/')
  }

  return { token }
}

export default Login
