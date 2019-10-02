import React, { useContext, useState } from 'react'
import Router from 'next/router'
import { Button, Row, Col, Icon, Divider, Empty, Spin } from 'antd'
import { Store } from '../store'
import { http } from '../http'
import QuestionCard from './question-card'
import IQuestion from '../interfaces/IQuestion'

const Dashboard = ({ dashboardQuestions }) => {
  const { user } = useContext(Store)
  const [questions, setQuestions] = useState([...dashboardQuestions])

  const removeQuestion = async (id: string) => {
    await http.delete(`question/${id}`)
    setQuestions(questions.filter(q => q.id !== id))
  }

  return user.token === '' ? (
    <Spin
      size="large"
      indicator={<Icon type="loading" spin />}
      style={{ display: 'flex', justifyContent: 'center' }}
    />
  ) : (
    <>
      {' '}
      <Row
        type="flex"
        justify="space-between"
        style={{ alignItems: 'baseline', padding: '0 1rem' }}>
        <Col>
          <h3>
            Welcome {user.firstName} {user.lastName}!
          </h3>
        </Col>
        <Col>
          <Button.Group size="large">
            <Button
              type="primary"
              onClick={() =>
                Router.push('/user/[user]', `/user/${user.username}`)
              }>
              @{user.username}
            </Button>
            <Button type="primary" onClick={() => Router.push('/settings')}>
              <Icon type="setting" />
            </Button>
          </Button.Group>
        </Col>
      </Row>
      <Divider />
      <Row type="flex" justify="center" align="middle">
        {questions.length === 0 ? (
          <Empty
            description="You have no questions to answer."
            style={{ margin: 'calc(100vh/5) 0' }}
          />
        ) : (
          <Col sm={20} lg={16}>
            {questions.map((q: IQuestion) => (
              <QuestionCard
                key={q.id}
                question={q}
                removeQuestion={removeQuestion}
              />
            ))}
          </Col>
        )}
      </Row>
    </>
  )
}

export default Dashboard
