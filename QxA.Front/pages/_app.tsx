import React from 'react'
import App from 'next/app'
import { StoreProvider } from '../store'
import Layout from '../components/layout'
import '../styles/index.less'

export default class QxAApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreProvider>
    )
  }
}
