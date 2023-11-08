import { GravityResponse } from '@src/shared/types'

export enum EventMessage {
  START = 'start',
  STOP = 'stop',
}

export function sendRuntimeMessage<RESPONSE_DATA>(
  event: EventMessage,
): Promise<GravityResponse<RESPONSE_DATA>> {
  return chrome.runtime.sendMessage(event)
}

export async function sendActiveTabMessage<RESPONSE_DATA>(
  event: EventMessage,
): Promise<GravityResponse<RESPONSE_DATA>> {
  const activeTabs = await chrome.tabs.query({
    active: true,
  })
  if (activeTabs.length !== 1) {
    return { data: null, error: 'No single active tab' }
  }
  return chrome.tabs.sendMessage(activeTabs[0].id, event)
}
