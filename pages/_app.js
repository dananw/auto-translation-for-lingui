import React from "react";
import NextApp from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/style.css'

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Component {...pageProps} />
    );
  }
}

export default App