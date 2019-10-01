import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { StoreProvider } from '../store'
import Layout from '../components/layout'
import '../styles/index.less'

export default class QxAApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>QxA - Ask &amp; Answer</title>
          <link
            href="https://fonts.googleapis.com/css?family=Lusitana:400,700&display=swap&text=QxAsk%26nswer"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap"
            rel="stylesheet"
          />
        </Head>
        <StoreProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StoreProvider>
      </>
    )
  }
}
