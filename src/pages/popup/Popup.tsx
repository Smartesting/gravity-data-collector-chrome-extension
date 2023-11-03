import React, { useEffect, useState } from 'react'
import '@pages/popup/Popup.css'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'
import { sendActiveTabMessage } from '@src/shared/messages'
import { CollectorDriverCommand, CollectorState } from '@src/shared/types'
import { CollectorOptions } from '@smartesting/gravity-data-collector'

const Popup = () => {
  const [state, setState] = useState(CollectorState.STOPPED)
  const [error, setError] = useState<string | null>(null)
  const [authKey, setAuthKey] = useState('')
  const [gravityServerUrl, setGravityServerUrl] = useState<string>('')
  const [debug, setDebug] = useState(false)
  const isRunning = state === CollectorState.RUNNING
  const options = { gravityServerUrl, authKey, debug }

  useEffect(() => {
    chrome.storage.session.get('gdc_state').then((response) => {
      if (response.gdc_state) setState(response.gdc_state)
    })
    chrome.storage.session.get('gdc_options').then((response) => {
      if (response.gdc_options) {
        const { authKey, gravityServerUrl, debug } =
          response.gdc_options as Partial<CollectorOptions>
        setAuthKey(authKey)
        setGravityServerUrl(gravityServerUrl)
        setDebug(debug)
      }
    })
  }, [])

  function updateState(newState: CollectorState) {
    chrome.storage.session
      .set({ gdc_state: newState, gdc_options: options })
      .then(() => {
        setState(newState)
      })
  }

  function toggle() {
    const command = isRunning
      ? CollectorDriverCommand.STOP
      : CollectorDriverCommand.PLAY
    sendActiveTabMessage<CollectorState>({
      gdc_driverCommand: command,
      gdc_collectorOptions: options,
    })
      .then(({ data, error }) => {
        if (error) setError(error)
        if (data) updateState(data)
      })
      .catch((e) => setError(e.message))
  }

  return (
    <div className='popup'>
      <h3>Gravity Data Collector</h3>
      <div className='body'>
        <div>
          Auth key:
          <input
            disabled={isRunning}
            value={authKey}
            onChange={(event) => {
              setAuthKey(event.target.value)
            }}
          />
        </div>
        <div>
          Gravity server url:
          <input
            disabled={isRunning}
            value={gravityServerUrl}
            onChange={(event) => {
              setGravityServerUrl(event.target.value)
            }}
          />
        </div>
        <div>
          <input
            type='checkbox'
            id='debug'
            checked={debug}
            disabled={isRunning}
            onChange={(event) => setDebug(event.target.checked)}
          />
          <label htmlFor='debug'>debug mode</label>
          <button id='GDC-play' onClick={toggle}>
            {isRunning ? 'stop' : 'play'}
          </button>
        </div>
      </div>
      <div className='footer-error'>{error}</div>
    </div>
  )
}

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>,
)
