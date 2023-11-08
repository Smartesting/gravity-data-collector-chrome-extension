import { GravityResponse } from '@src/shared/types'
// eslint-disable-next-line import/no-duplicates
import { CollectorOptions } from '@smartesting/gravity-data-collector'
// eslint-disable-next-line import/no-duplicates
import GravityCollector from '@smartesting/gravity-data-collector/dist'
import CollectorWrapper from '@smartesting/gravity-data-collector/dist/collector/CollectorWrapper'
import { GRAVITY_SESSION_TRACKING_SUSPENDED } from '@smartesting/gravity-data-collector/dist/tracking-handler/TrackingHandler'

export function initializeCollector(
  options: Partial<CollectorOptions>,
): string | null {
  try {
    console.log('initialize collector ', options)
    GravityCollector.init(options)
    const { error, data: collectorWrapper } = getCollectorWrapper()
    if (error) {
      console.log('->', error)
      return error
    }
    const trackingHandler = collectorWrapper.trackingHandler
    trackingHandler.activateTracking()
    console.log('->ok')
    return null
  } catch (e) {
    console.log('->', e.message)
    return e.message
  }
}

export function terminateCollector(): string | null {
  console.log('terminate collector')
  const { error, data: collectorWrapper } = getCollectorWrapper()
  if (error) {
    console.log('->', error)
    return error
  }
  collectorWrapper.trackingHandler.deactivateTracking()
  collectorWrapper.sessionIdHandler.generateNewSessionId()
  window.sessionStorage.removeItem(GRAVITY_SESSION_TRACKING_SUSPENDED)
  delete (window as any)._GravityCollector
  console.log('->ok')
  return null
}

function getCollectorWrapper(): GravityResponse<CollectorWrapper> {
  const collector = (window as any)._GravityCollector
  if (collector === undefined) {
    return { error: 'No Collector', data: null }
  }
  const collectorWrapper = collector.collectorWrapper
  if (collectorWrapper === undefined) {
    return { error: 'No Collector wrapper', data: null }
  }
  return { error: null, data: collectorWrapper }
}
