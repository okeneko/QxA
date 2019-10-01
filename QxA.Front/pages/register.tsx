import React, { useState } from 'react'
import http from '../http'
import Router from 'next/router'
import { Card, Form, Input, Row, Col, Button, message } from 'antd'

const RegisterForm = ({ form }) => {
  const {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    setFields,
    resetFields
  } = form
  const [loading, setLoading] = useState(false)
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateFields(async (error, values) => {
      if (!error) {
        setLoading(true)
        try {
          const { data } = await http.post('auth/register', {
            username: values.username.trim(),
            email: values.email.trim(),
            firstName: values.firstname.trim(),
            lastName: values.lastname.trim(),
            password: values.password
          })

          setLoading(false)
          resetFields()
          message.success(
            'The account was successfully created. You can log in now.',
            8
          )
          Router.push('/login')
        } catch ({ response }) {
          setLoading(false)
          switch (response.data[0].code) {
            case 'DuplicateUserName':
              setFields({
                username: {
                  value: values.username,
                  errors: [new Error(response.data[0].description)]
                }
              })
              break
            case 'DuplicateEmail':
              setFields({
                email: {
                  value: values.email,
                  errors: [new Error(response.data[0].description)]
                }
              })
              break
            default:
              message.error('There was an error during the registration.')
              break
          }
        }
      }
    })
  }

  const comparePasswords = (rule, value, callback) => {
    if (value && value !== getFieldValue('password'))
      callback('The passwords must be equal.')
    callback()
  }

  return (
    <Form onSubmit={submit} className="form">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: 'Username cannot be empty.' },
                { whitespace: true, message: 'Username cannot be empty.' }
              ]
            })(<Input placeholder="Username" allowClear disabled={loading} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'Not a valid email.' },
                { required: true, message: 'Email cannot be empty.' },
                { whitespace: true, message: 'Email cannot be empty.' }
              ]
            })(<Input placeholder="Email" allowClear disabled={loading} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('firstname', {
              rules: [
                { required: true, message: 'First name cannot be empty.' },
                { whitespace: true, message: 'First name cannot be empty.' }
              ]
            })(
              <Input placeholder="First Name" allowClear disabled={loading} />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('lastname', {
              rules: [
                { required: true, message: 'Last name cannot be empty.' },
                { whitespace: true, message: 'Last name cannot be empty.' }
              ]
            })(<Input placeholder="Last Name" allowClear disabled={loading} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Password cannot be empty.' }]
            })(
              <Input.Password
                placeholder="Password"
                allowClear
                disabled={loading}
              />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item>
            {getFieldDecorator('repeatPassword', {
              rules: [
                { required: true, message: 'Password cannot be empty.' },
                { validator: comparePasswords }
              ]
            })(
              <Input.Password
                placeholder="Repeat password"
                allowClear
                disabled={loading}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

const Register = (): JSX.Element => {
  const CreatedRegisterForm = Form.create({ name: 'register_form' })(
    RegisterForm
  )
  return (
    <Row type="flex" justify="center" align="middle" style={{ height: '100%' }}>
      <Col xs={24} md={18} lg={12}>
        <Card
          title="Register"
          bordered={false}
          headStyle={{ textAlign: 'center' }}>
          <CreatedRegisterForm />
        </Card>
      </Col>
    </Row>
  )
}

export default Register
