import {
  CollectorDriverCommand,
  GravityContentPageRequestSubject,
} from '@src/shared/types'
import {
  initializeCollector,
  terminateCollector,
} from '@pages/content/dataCollector/controls'
import { sendRuntimeMessage } from '@src/shared/messages'
import { isPopupGravityRequest } from '@src/shared/typeGuards'
import { CollectorOptions } from '@smartesting/gravity-data-collector'

const VERBOSE = true

function logging<T>(t: T): T {
  if (VERBOSE) console.log(t)
  return t
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!isPopupGravityRequest(request)) {
    return
  }
  const { gdc_driverCommand: command, gdc_collectorOptions: options } = request
  switch (command) {
    case CollectorDriverCommand.START: {
      sendResponse(logging(initializeCollector(options)))
      return
    }
    case CollectorDriverCommand.STOP: {
      sendResponse(logging(terminateCollector()))
      return
    }
  }
})

console.log('check collector to load')
sendRuntimeMessage<Partial<CollectorOptions>>({
  gdc_subject: GravityContentPageRequestSubject.RUNNING_CONFIGURATION,
}).then((response) => {
  console.log({ response })
  if (!response || !response.data) {
    console.log('No collector to load')
    return
  }
  console.log('loading collector with ', response.data)
  logging(initializeCollector(response.data))
})
