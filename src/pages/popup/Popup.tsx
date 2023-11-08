import React, { useEffect, useState } from 'react'
import '@pages/popup/Popup.css'
import withSuspense from '@src/shared/hoc/withSuspense'
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary'
import useStorage from '@src/shared/hooks/useStorage'
import storage from '@src/shared/storages/CollectorConfigurationStorage'
import { EventMessage, sendActiveTabMessage } from '@src/shared/messages'
import {
  DEFAULT_COLLECTOR_CONFIGURATION,
  GravityServerUrls
} from '@src/shared/constants'

const Popup: React.FunctionComponent = () => {
  const { isRunning, options } =
    useStorage(storage) ?? DEFAULT_COLLECTOR_CONFIGURATION
  const [error, setError] = useState<string | null>(null)
  const [authKey, setAuthKey] = useState<string>(options.authKey)
  const [gravityServerUrl, setGravityServerUrl] = useState<string>(
    options.gravityServerUrl
  )
  const [debug, setDebug] = useState(options.debug ?? false)

  console.log('[popup] render', { isRunning, options })

  useEffect(() => {
    const listener = function (request, sender, sendResponse) {
      console.log('[popup] onMessage', request)
      switch (request) {
        case EventMessage.START:
          if (!storage.getSnapshot().isRunning)
            storage.start().catch(console.error)
          break

        case EventMessage.STOP:
          if (storage.getSnapshot().isRunning)
            storage.stop().catch(console.error)
          break
      }
      sendResponse(null)
      return true
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => {
      if (chrome.runtime.onMessage.hasListener(listener)) {
        chrome.runtime.onMessage.removeListener(listener)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function saveConfiguration() {
    return storage.save({
      authKey,
      gravityServerUrl,
      debug
    })
  }

  function trigger(event: EventMessage) {
    sendActiveTabMessage(event)
      .then(() => console.log('[popup] trigger ' + event))
      .catch(console.error)
  }

  function start() {
    saveConfiguration()
      .then(storage.start)
      .then(() => trigger(EventMessage.START))
  }

  function stop() {
    storage.stop().then(() => trigger(EventMessage.STOP))
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
                  type={'text'}
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
                {Object.keys(GravityServerUrls).map((key) => (
                  <ServerRadioInput
                    key={key}
                    server={key}
                    currentServerUrl={gravityServerUrl}
                    onSelect={setGravityServerUrl}
                    isRunning={isRunning}
                  />
                ))}
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
  <div> Error Occur </div>
)

const ServerRadioInput: React.FunctionComponent<{
  server: string
  currentServerUrl: string
  onSelect: (url: string) => void
  isRunning: boolean
}> = ({ server, currentServerUrl, onSelect, isRunning }) => {
  const url = GravityServerUrls[server]
  return (
    <div style={{ display: 'flex', paddingRight: '6px' }}>
      <input
        disabled={isRunning}
        type='radio'
        id={server}
        name='gravityServerUrl'
        value={server}
        checked={url === currentServerUrl}
        onChange={() => onSelect(url)}
      />
      <label htmlFor={server} title={url} style={{ margin: 'auto' }}>
        {server.toLowerCase()}
      </label>
    </div>
  )
}
