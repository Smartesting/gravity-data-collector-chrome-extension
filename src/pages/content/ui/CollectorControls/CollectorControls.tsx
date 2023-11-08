import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp'
import useStorage from '@src/shared/hooks/useStorage'
import storage from '@src/shared/storages/CollectorConfigurationStorage'
import { CollectorConfiguration } from '@src/shared/types'
import { DEFAULT_COLLECTOR_CONFIGURATION } from '@src/shared/constants'
import { EventMessage, sendRuntimeMessage } from '@src/shared/messages'
import { makeLogger } from '@src/shared/logger'

const logger = makeLogger('controls')

// noinspection CssUnknownProperty
const Container = styled.div`
  font-size: 14px;
  color: black;
  background-color: #f3f3f3;
  border: 1px darkgray;

  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);

  z-index: 100000;
  padding: 0;
  min-width: 250px;
  display: flex;
  flex-direction: column;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  button {
    cursor: pointer;
  }
`

const CollectorControls: React.FunctionComponent = () => {
  const [collapsed, setCollapsed] = useState(false)
  const configuration: CollectorConfiguration | null = useStorage(storage)
  logger('render', { configuration })

  useEffect(() => {
    const listener = function (request, sender, sendResponse) {
      logger('onMessage', request)
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

  function trigger(event: EventMessage) {
    sendRuntimeMessage(event)
      .then(() => logger('trigger ' + event))
      .catch(console.error)
  }

  function start() {
    storage.start().then(() => trigger(EventMessage.START))
  }

  function stop() {
    storage.stop().then(() => trigger(EventMessage.STOP))
  }

  if (emptyConfiguration(configuration)) return null //no controls if collector has never been launched
  const isRunning = configuration.isRunning
  return (
    <Container data-testid='gdc-controls-container'>
      <ExpandButton
        data-testid='gdc-expand'
        onClick={() => setCollapsed(!collapsed)}
      >
        <FontAwesomeIcon icon={collapsed ? faCaretDown : faCaretUp} />
      </ExpandButton>
      {!collapsed && (
        <Controls data-testid='gdc-controls'>
          <div style={{ flexGrow: 1 }}>
            {isRunning
              ? 'Gravity collector is running... '
              : 'Gravity collector is stopped '}
          </div>
          <ControlButton data-testid='gdc-play-stop-button'>
            <FontAwesomeIcon
              onClick={isRunning ? stop : start}
              icon={isRunning ? faStop : faPlay}
              color={isRunning ? 'red' : 'black'}
            />
          </ControlButton>
        </Controls>
      )}
    </Container>
  )
}

export default CollectorControls

const ExpandButton = styled.button`
  cursor: pointer;
  width: 100%;
  display: flex;
  border: none;

  :hover {
    background-color: #d3d3d3;
  }

  & svg {
    height: 12px;
    flex-grow: 1;
    color: darkgray;
  }
`

const Controls = styled.div`
  display: flex;
  padding: 8px;

  & > * {
    margin: auto;
  }
`

const ControlButton = styled.button`
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 8px;
  display: flex;
  height: 26px;
  width: 26px;

  :hover {
    border-color: black;
    background-color: white;

    & svg {
      color: black;
    }
  }

  & svg {
    margin: auto;
    height: 18px;
  }
`

function emptyConfiguration(
  configuration: CollectorConfiguration | null
): boolean {
  if (!configuration) return true
  const { isRunning, options } = configuration
  return (
    isRunning === DEFAULT_COLLECTOR_CONFIGURATION.isRunning &&
    options.debug === DEFAULT_COLLECTOR_CONFIGURATION.options.debug &&
    options.authKey === DEFAULT_COLLECTOR_CONFIGURATION.options.authKey &&
    options.gravityServerUrl ===
      DEFAULT_COLLECTOR_CONFIGURATION.options.gravityServerUrl
  )
}
