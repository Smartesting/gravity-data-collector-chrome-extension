import React, { useEffect, useState } from 'react'
import '@pages/popup/Popup.css'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'
import { sendActiveTabMessage } from '@src/shared/messages'
import { CollectorDriverCommand, CollectorState } from '@src/shared/types'
import SessionConfigurationStorage from '@src/shared/SessionConfigurationStorage'
import { unstable_batchedUpdates } from 'react-dom'

const DEFAULT_GRAVITY_SERVER_URL =
  'https://gravity-api-production.osc-fr1.scalingo.io'

const configurationStorage = new SessionConfigurationStorage()

const Popup: React.FunctionComponent = () => {
  const [state, setState] = useState(CollectorState.STOPPED)
  const [error, setError] = useState<string | null>(null)
  const [authKey, setAuthKey] = useState('')
  const [gravityServerUrl, setGravityServerUrl] = useState<string>(
    DEFAULT_GRAVITY_SERVER_URL,
  )
  const [debug, setDebug] = useState(false)
  const isRunning = state === CollectorState.RUNNING
  const options = { gravityServerUrl, authKey, debug }

  useEffect(() => {
    configurationStorage.getState().then((state) => {
      setState(state ?? CollectorState.STOPPED)
    })
    configurationStorage.getOptions().then((options) => {
      if (options) {
        const { authKey, gravityServerUrl, debug } = options
        unstable_batchedUpdates(() => {
          setAuthKey(authKey)
          setGravityServerUrl(gravityServerUrl)
          setDebug(debug)
        })
      }
    })
  }, [])

  function saveConfiguration() {
    return configurationStorage.saveOptions(options)
  }

  function start() {
    saveConfiguration().then(() => {
      sendActiveTabMessage<CollectorState>({
        gdc_driverCommand: CollectorDriverCommand.START,
        gdc_collectorOptions: options,
      })
        .then(({ data, error }) => {
          if (error) setError(error)
          if (data) {
            configurationStorage.saveState(CollectorState.RUNNING).then(() => {
              setState(CollectorState.RUNNING)
            })
          }
        })
        .catch((e) => {
          if (e.message.startsWith('Could not establish connection')) {
            setError('Please refresh the active Chrome tab then retry')
          } else {
            setError(e.message)
          }
        })
    })
  }

  function stop() {
    sendActiveTabMessage<CollectorState>({
      gdc_driverCommand: CollectorDriverCommand.STOP,
      gdc_collectorOptions: options,
    })
      .then(({ data, error }) => {
        if (error) setError(error)
        if (data) {
          configurationStorage.saveState(CollectorState.STOPPED).then(() => {
            setState(CollectorState.STOPPED)
          })
        }
      })
      .catch((e) => setError(e.message))
  }

  return (
    <div className='popup'>
      <h3>Gravity Data Collector</h3>
      <div className='body'>
        <table>
          <tbody>
            <tr>
              <td>Auth key</td>
              <td>
                <input
                  disabled={isRunning}
                  value={authKey}
                  onBlur={saveConfiguration}
                  onChange={(event) => {
                    setError(null)
                    setAuthKey(event.target.value)
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Gravity server</td>
              <td>
                <input
                  disabled={isRunning}
                  value={gravityServerUrl}
                  onBlur={saveConfiguration}
                  onChange={(event) => {
                    setError(null)
                    setGravityServerUrl(event.target.value)
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor='debug'>debug mode</label>
              </td>
              <td>
                <input
                  type='checkbox'
                  id='debug'
                  checked={debug}
                  disabled={isRunning}
                  onChange={(event) => {
                    setError(null)
                    setDebug(event.target.checked)
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                {isRunning ? (
                  <button id='GDC-stop' onClick={stop}>
                    STOP
                  </button>
                ) : (
                  <button id='GDC-start' onClick={start}>
                    START
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='footer-error'>{error}</div>
    </div>
  )
}

export default withErrorBoundary(
  withSuspense(Popup, <div> Loading ... </div>),
  <div> Error Occur </div>,
)
