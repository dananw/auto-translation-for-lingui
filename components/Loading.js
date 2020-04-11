import React from 'react'
import { Spinner } from 'reactstrap';

const Loading = ({isLoading}) => {
  return(
    <div className={`overlay ${isLoading ? '' : 'hide'}`}>
      <div className="loading-box">
        <Spinner color="primary"/>
        <h3>Loading...</h3>
      </div>
    </div>
  )
}

export default Loading;