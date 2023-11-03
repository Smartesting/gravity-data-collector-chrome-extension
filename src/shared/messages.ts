import { GravityRequest, GravityResponse } from '@src/shared/types'

export function sendRuntimeMessage<DATA>(
  request: GravityRequest,
): Promise<GravityResponse<DATA>> {
  return chrome.runtime.sendMessage(request)
}

export async function sendActiveTabMessage<DATA>(
  request: GravityRequest,
): Promise<GravityResponse<DATA>> {
  const activeTabs = await chrome.tabs.query({
    active: true,
  })
  if (activeTabs.length !== 1) {
    return { data: null, error: 'No single active tab' }
  }
  return chrome.tabs.sendMessage(activeTabs[0].id, request)
}
