// eslint-disable-next-line import/no-duplicates
import GravityCollector from '@smartesting/gravity-data-collector/dist'
// eslint-disable-next-line import/no-duplicates
import { CollectorOptions } from '@smartesting/gravity-data-collector'
import { isGravityRequest } from '@src/shared/typeGuards'
import {
  CollectorDriverCommand,
  CollectorState,
  GravityResponse,
} from '@src/shared/types'
import CollectorWrapper from '@smartesting/gravity-data-collector/dist/collector/CollectorWrapper'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (isGravityRequest(request)) {
    const { gdc_driverCommand: command, gdc_collectorOptions: options } =
      request

    switch (command) {
      case CollectorDriverCommand.PLAY: {
        sendResponse(initializeCollector(options))
        return
      }
      case CollectorDriverCommand.STOP: {
        sendResponse(terminateCollector())
        return
      }
    }
  }
})

function initializeCollector(
  options: Partial<CollectorOptions>,
): GravityResponse<CollectorState> {
  try {
    GravityCollector.init(options)
    const { error, data: collectorWrapper } = getCollectorWrapper()
    if (error) {
      return { error, data: null }
    }
    const trackingHandler = collectorWrapper.trackingHandler
    trackingHandler.activateTracking()
    return { error: null, data: CollectorState.RUNNING }
  } catch (e) {
    return { error: e.message, data: null }
  }
}

function terminateCollector(): GravityResponse<CollectorState> {
  const { error, data: collectorWrapper } = getCollectorWrapper()
  if (error) return { error, data: null }
  collectorWrapper.sessionIdHandler.generateNewSessionId()
  collectorWrapper.trackingHandler.deactivateTracking()
  delete (window as any)._GravityCollector
  return { error: null, data: CollectorState.STOPPED }
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
