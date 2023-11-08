import {
  initializeCollector,
  terminateCollector
} from '@pages/content/dataCollector/controls'
import collectorConfigurationStorage from '@src/shared/storages/CollectorConfigurationStorage'
import { EventMessage } from '@src/shared/messages'
import { makeLogger } from '@src/shared/logger'

const logger = makeLogger('content')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  logger('onMessage', request)
  if (request === EventMessage.START || request === EventMessage.STOP) {
    refreshCollector().then((error) => {
      logger('refresh collector => error=', error)
      sendResponse(error)
    })
    return true
  }
})

refreshCollector().then((error) => {
  logger('load => error=' + error)
})

function refreshCollector(): Promise<string | null> {
  return collectorConfigurationStorage.get().then((configuration) => {
    if (!configuration || !configuration.isRunning) {
      return terminateCollector()
    }
    return initializeCollector(configuration.options)
  })
}
