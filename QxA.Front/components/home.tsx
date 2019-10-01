import React from 'react'
import Router from 'next/router'
import { Row, Typography, Col, Button } from 'antd'
const { Title, Paragraph, Text } = Typography

const Home = () => {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        height: '100%',
        textAlign: 'center'
      }}>
      <Col
        xs={24}
        sm={10}
        lg={8}
        xl={6}
        style={{
          fontSize: '8rem',
          fontFamily: 'Lusitana, serif'
        }}>
        QxA
      </Col>
      <Col
        xs={24}
        sm={10}
        lg={8}
        xl={6}
        style={{ fontSize: '2rem', display: 'flex', flexDirection: 'column' }}>
        <span style={{ marginBottom: '0.5rem' }}>Ask & Answer</span>
        <Button
          type="primary"
          size="large"
          onClick={() => Router.push('/login')}>
          Get Started
        </Button>
      </Col>
    </Row>
  )
}

export default Home
