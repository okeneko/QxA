import React, { useState } from 'react'
import {
  Card,
  Comment,
  Collapse,
  Button,
  Tooltip,
  Input,
  Result,
  Icon,
  Form,
  Popconfirm,
  message
} from 'antd'
import Link from 'next/link'
import moment from 'moment'
import { http } from '../http'
import IQuestionCardProps from '../interfaces/IQuestionCardProps'
const { Panel } = Collapse
const { TextArea } = Input

const QuestionCard = ({ question, removeQuestion }: IQuestionCardProps) => {
  const [opened, setOpened] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [removingLoading, setRemovingLoading] = useState(false)

  const [answer, setAnswer] = useState('')
  const [emptyAnswer, setEmptyAnswer] = useState(false)
  const [emptyAnswerText, setEmptyAnswerText] = useState(' ')

  const submitAnswer = async () => {
    if (answer.trim() === '') {
      setEmptyAnswer(true)
      setEmptyAnswerText('The answer cannot be empty.')
    } else {
      setEmptyAnswer(false)
      setEmptyAnswerText('')
      setLoading(true)

      try {
        await http.put(`answer/${question.id}`, { answer })
        setAnswered(true)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        message.error(
          'An error occurred, the question could not be answered.',
          5
        )
      }
    }
  }

  const remove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setRemovingLoading(true)
    try {
      await removeQuestion(question.id)
      message.success('The question was successfully removed.', 5)
    } catch (error) {
      setRemovingLoading(false)
      message.error('An error occurred, the question could not be removed.', 5)
    }
  }

  return (
    <Card
      key={question.id}
      bordered={false}
      style={{ marginBottom: '1rem' }}
      bodyStyle={{ padding: '1rem' }}
      className="question-card">
      <Comment
        author={
          !!question.asker ? (
            <span style={{ fontSize: '1rem' }}>
              <strong>
                {question.asker.firstName} {question.asker.lastName}{' '}
              </strong>
              <Link href="/user/[user]" as={`/user/${question.asker.userName}`}>
                <a>@{question.asker.userName}</a>
              </Link>
            </span>
          ) : (
            <strong style={{ fontSize: '1rem' }}>Anon</strong>
          )
        }
        datetime={
          <Tooltip
            title={moment(question.asked).format('HH:mm, Do [of] MMMM, YYYY')}>
            <span>asked {moment(question.asked).fromNow()}</span>
          </Tooltip>
        }
        content={
          <>
            <h1>{question.question}</h1>
            <Collapse
              bordered={false}
              onChange={() => setOpened(true)}
              expandIconPosition="right"
              expandIcon={({ isActive }) => {
                return !answered ? (
                  <Button.Group>
                    {!isActive ? (
                      <Button type="primary" onClick={() => setOpened(true)}>
                        Reply
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        loading={loading}
                        onClick={() => submitAnswer()}>
                        Submit answer
                      </Button>
                    )}
                    <Popconfirm
                      title="Are you sure you want to remove this question?"
                      okText="Yes"
                      cancelText="No"
                      okType="danger"
                      onConfirm={remove}
                      onCancel={e => e.stopPropagation()}>
                      <Button
                        type="danger"
                        loading={removingLoading}
                        onClick={e => e.stopPropagation()}>
                        <Icon type="delete" />
                      </Button>
                    </Popconfirm>
                  </Button.Group>
                ) : (
                  ''
                )
              }}>
              <Panel
                header=""
                key="1"
                disabled={opened}
                style={{ border: '0', color: 'white', cursor: 'auto' }}>
                {!answered ? (
                  <Form.Item
                    validateStatus={emptyAnswer ? 'error' : ''}
                    help={emptyAnswerText}>
                    <TextArea
                      style={{ marginTop: '1rem' }}
                      autosize={{ minRows: 2 }}
                      placeholder="Your answer..."
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                    />
                  </Form.Item>
                ) : (
                  <Result
                    style={{ padding: 0 }}
                    status="success"
                    title="Question answered successfully."
                  />
                )}
              </Panel>
            </Collapse>
          </>
        }
      />
    </Card>
  )
}

export default QuestionCard
