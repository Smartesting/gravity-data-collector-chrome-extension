import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp'

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
  const [isRunning, setIsRunning] = useState(false)

  //TODO if no conf no control

  return (
    <Container>
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
              onClick={() => setIsRunning(!isRunning)}
              icon={isRunning ? faStop : faPlay}
              color={isRunning ? 'red' : 'black'}
              style={{ height: '14px' }}
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
