import { GravityResponse } from '@src/shared/types'
// eslint-disable-next-line import/no-duplicates
import { CollectorOptions } from '@smartesting/gravity-data-collector'
// eslint-disable-next-line import/no-duplicates
import GravityCollector from '@smartesting/gravity-data-collector/dist'
import CollectorWrapper from '@smartesting/gravity-data-collector/dist/collector/CollectorWrapper'
import { GRAVITY_SESSION_TRACKING_SUSPENDED } from '@smartesting/gravity-data-collector/dist/tracking-handler/TrackingHandler'
import { makeLogger } from '@src/shared/logger'

const logger = makeLogger('dataCollector')

export function initializeCollector(
  options: Partial<CollectorOptions>
): string | null {
  try {
    logger('initialize', options)
    GravityCollector.init(options)
    const { error, data: collectorWrapper } = getCollectorWrapper()
    if (error) {
      logger('->', error)
      return error
    }
    const trackingHandler = collectorWrapper.trackingHandler
    trackingHandler.activateTracking()
    logger('->ok')
    return null
  } catch (e) {
    logger('->', e.message)
    return e.message
  }
}

export function terminateCollector(): string | null {
  logger('terminate')
  const { error, data: collectorWrapper } = getCollectorWrapper()
  if (error) {
    logger('->', error)
    return error
  }
  collectorWrapper.trackingHandler.deactivateTracking()
  collectorWrapper.sessionIdHandler.generateNewSessionId()
  window.sessionStorage.removeItem(GRAVITY_SESSION_TRACKING_SUSPENDED)
  delete (window as any)._GravityCollector
  logger('->ok')
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
