import React from 'react'
import '@pages/popup/Popup.css'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'

const Popup = () => {
  return <div className='App'>Gravity Data Collector</div>
}

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>,
)
