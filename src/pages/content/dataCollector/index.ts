import {
  initializeCollector,
  terminateCollector,
} from '@pages/content/dataCollector/controls'
import collectorConfigurationStorage from '@src/shared/storages/CollectorConfigurationStorage'
import { EventMessage } from '@src/shared/messages'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('[content] onMessage', request)
  if (request === EventMessage.START || request === EventMessage.STOP) {
    refreshCollector().then((error) => {
      console.log('[content] refresh collector => error=', error)
      sendResponse(error)
    })
    return true
  }
})

refreshCollector().then((error) => {
  console.log('[content] load => error=' + error)
})

function refreshCollector(): Promise<string | null> {
  return collectorConfigurationStorage.get().then((configuration) => {
    if (!configuration || !configuration.isRunning) {
      return terminateCollector()
    }
    return initializeCollector(configuration.options)
  })
}
