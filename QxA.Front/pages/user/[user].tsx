import React, { useContext, useEffect, useState } from 'react'
import ellipsis from 'text-ellipsis'
import axios from 'axios'
import cookie from 'cookie'
import { http, anonHttp } from '../../http'
import { Store } from '../../store'
import Router from 'next/router'
import IUser from '../../interfaces/IUser'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Empty,
  Button,
  Switch,
  message,
  Icon
} from 'antd'
import IQuestion from '../../interfaces/IQuestion'
import AnsweredQuestionCard from '../../components/answered-question-card'
const { TextArea } = Input

const User = ({ logged, profile, profileQuestions }) => {
  const { user } = useContext(Store)

  const [questions, setQuestions] = useState([...profileQuestions])

  useEffect(() => {
    setQuestions([...profileQuestions])
  }, [profileQuestions])

  const [question, setQuestion] = useState('')
  const [anon, setAnon] = useState(!logged)
  const [emptyQuestion, setEmptyQuestion] = useState(false)
  const [emptyQuestionText, setEmptyQuestionText] = useState('')
  const [loading, setLoading] = useState(false)

  const submitQuestion = async () => {
    if (question.trim() === '') {
      setEmptyQuestion(true)
      setEmptyQuestionText('The question cannot be empty.')
    } else {
      setEmptyQuestion(false)
      setEmptyQuestionText('')
      setLoading(true)

      try {
        await http.post('question', {
          question,
          ownerUserName: profile.username,
          askerUserName: anon ? '' : user.username
        })
        setQuestion('')
        if (logged) setAnon(false)
        setLoading(false)
        message.success('The question was successfully submitted.', 5)
      } catch (error) {
        setLoading(false)
        message.error(
          'An error occurred, the question could not be submitted.',
          5
        )
      }
    }
  }

  const removeQuestion = async (id: string) => {
    await http.delete(`answer/${id}`)
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <Row gutter={32} style={{ height: '100%' }}>
      <Col
        xs={{ span: 24, offset: 0 }}
        md={{ span: 10, offset: 0 }}
        lg={{ span: 8, offset: 2 }}>
        <Card
          bordered={false}
          title={
            <Row type="flex" justify="space-between">
              <Col>
                <h1 style={{ margin: 0 }}>
                  {ellipsis(`${profile.firstName} ${profile.lastName}`, 20)}
                </h1>
                <p style={{ margin: 0 }}>@{profile.username}</p>
              </Col>
              {profile.username === user.username && (
                <Col>
                  <Button
                    type="link"
                    size="large"
                    shape="circle"
                    icon="setting"
                    onClick={() => Router.push('/settings')}></Button>
                </Col>
              )}
            </Row>
          }
          style={{ width: '100%', marginBottom: '1rem' }}>
          <h3>Ask {profile.firstName} a question:</h3>
          <Form.Item
            validateStatus={emptyQuestion ? 'error' : ''}
            help={emptyQuestionText}>
            <TextArea
              autosize={{ minRows: 2 }}
              placeholder="Your question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </Form.Item>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{ padding: '0 1rem' }}>
            <Col>
              <Switch
                checked={anon}
                disabled={!logged}
                checkedChildren="anon"
                unCheckedChildren="anon"
                onChange={checked => setAnon(checked)}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                loading={loading}
                onClick={() => submitQuestion()}>
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} md={14} lg={12}>
        {questions.length === 0 ? (
          <Empty
            description={`${profile.firstName} has answered no questions.`}
            style={{ margin: 'calc(100vh/6) 0' }}
          />
        ) : (
          questions.map((q: IQuestion) => (
            <AnsweredQuestionCard
              key={q.id}
              question={q}
              removeQuestion={removeQuestion}
            />
          ))
        )}
      </Col>
    </Row>
  )
}

User.getInitialProps = async ({ req, query: { user } }) => {
  console.log(user)
  const { token } = cookie.parse(
    req ? req.headers.cookie || '' : document.cookie
  )

  try {
    const [auth, answers] = await axios.all([
      anonHttp.get(`auth/${user}`),
      anonHttp.get(`answers/${user}`)
    ])

    const authData = auth.data
    const answerData = answers.data

    const profileUser: IUser = {
      username: authData.userName,
      firstName: authData.firstName,
      lastName: authData.lastName
    }

    return {
      logged: !!token,
      profile: profileUser,
      profileQuestions: answerData
    }
  } catch (error) {
    console.log(error)
  }

  return { logged: !!token }
}

export default User
