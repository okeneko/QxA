import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Card, Typography, Button, Divider, message } from 'antd'
import http from '../http'
import { Store } from '../store'
import IUser from '../interfaces/IUser'
import RemoveAccountModal from '../components/remove-account-modal'
const { Title, Paragraph, Text } = Typography

const settings = () => {
  const { user, dispatch } = useContext(Store)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
  }, [user])

  const saveChanges = async () => {
    const closeLoading = message.loading('The changes are being saved.', 10)

    const editedUser: IUser = { ...user, firstName, lastName }
    dispatch({
      type: 'EDIT',
      payload: editedUser
    })

    try {
      await http.put(`auth/${user.username}`, {
        firstname: firstName,
        lastname: lastName
      })
      closeLoading()
      message.success('The changes were saved successfully.', 5)
    } catch (error) {
      closeLoading()
      message.error("An error occurred, the changes weren't saved.", 5)
    }
  }

  return (
    <>
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: '100%' }}>
        <Col xs={24} md={16} lg={8}>
          <Card title="Account Settings" bordered={false}>
            <Typography>
              <Title level={4}>Edit your account</Title>
              <Paragraph>First Name: </Paragraph>
              <Paragraph editable={{ onChange: name => setFirstName(name) }}>
                {firstName}
              </Paragraph>
              <Paragraph>Last Name: </Paragraph>
              <Paragraph editable={{ onChange: name => setLastName(name) }}>
                {lastName}
              </Paragraph>
              <Row type="flex" justify="center">
                <Button type="primary" block onClick={() => saveChanges()}>
                  Save changes
                </Button>
              </Row>
              <Divider />
              <Title level={4}>Remove your account</Title>
              <Paragraph>
                Do you wish to remove your <Text strong>QxA</Text> account? This
                action is final and you won't be able to get it back.
              </Paragraph>
              <Button type="danger" block onClick={() => setModalVisible(true)}>
                Remove
              </Button>
            </Typography>
          </Card>
        </Col>
      </Row>
      <RemoveAccountModal
        modalVisible={modalVisible}
        setVisible={setModalVisible}
      />
    </>
  )
}

export default settings
