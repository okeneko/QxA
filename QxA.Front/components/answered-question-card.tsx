import React, { useState, useContext } from 'react'
import { Card, Comment, Button, Tooltip, message, Icon, Popconfirm } from 'antd'
import Link from 'next/link'
import moment from 'moment'
import IQuestionCardProps from '../interfaces/IQuestionCardProps'
import { Store } from '../store'

const AnsweredQuestionCard = ({
  question,
  removeQuestion
}: IQuestionCardProps) => {
  const { user } = useContext(Store)
  const remove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await removeQuestion(question.id)
      message.success('The question was successfully removed.', 5)
    } catch (error) {
      message.error('An error occurred, the question could not be removed.', 5)
    }
  }

  return (
    <Card
      key={question.id}
      bordered={false}
      style={{ marginBottom: '1rem' }}
      bodyStyle={{ position: 'relative', padding: '0.5rem 1rem 0 1rem' }}
      className="question-card">
      <>
        {user.username === question.owner.userName && (
          <Popconfirm
            title="Are you sure you want to remove this question?"
            placement="left"
            okText="Yes"
            cancelText="No"
            okType="danger"
            onConfirm={remove}>
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                cursor: 'pointer'
              }}>
              <Icon type="close" />
            </div>
          </Popconfirm>
        )}
        <Comment
          style={{ pointerEvents: 'none' }}
          author={
            <span style={{ pointerEvents: 'auto', fontSize: '1rem' }}>
              {!!question.asker ? (
                <>
                  <strong>
                    {question.asker.firstName} {question.asker.lastName}{' '}
                  </strong>
                  <Link
                    href="/user/[user]"
                    as={`/user/${question.asker.userName}`}>
                    <a>@{question.asker.userName}</a>
                  </Link>
                </>
              ) : (
                <strong>Anon</strong>
              )}
            </span>
          }
          datetime={
            <Tooltip
              placement="right"
              title={moment(question.asked).format(
                'HH:mm, Do [of] MMMM, YYYY'
              )}>
              <span style={{ pointerEvents: 'auto' }}>
                asked {moment(question.asked).fromNow()}
              </span>
            </Tooltip>
          }
          content={
            <div style={{ pointerEvents: 'auto' }}>
              <h1>{question.question}</h1>
              <Comment
                datetime={
                  <Tooltip
                    placement="right"
                    title={moment(question.answered).format(
                      'HH:mm, Do [of] MMMM, YYYY'
                    )}>
                    <span>answered {moment(question.answered).fromNow()}</span>
                  </Tooltip>
                }
                content={<h3>{question.answer}</h3>}
              />
            </div>
          }
        />
      </>
    </Card>
  )
}

export default AnsweredQuestionCard
