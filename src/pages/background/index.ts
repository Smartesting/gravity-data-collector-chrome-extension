import { isContentPageGravityRequest } from '@src/shared/typeGuards'
import {
  CollectorState,
  GravityContentPageRequest,
  GravityContentPageRequestSubject,
  GravityResponse,
} from '@src/shared/types'
import SessionConfigurationStorage from '@src/shared/SessionConfigurationStorage'
import { CollectorOptions } from '@smartesting/gravity-data-collector'

console.log('background loaded at ' + new Date().toISOString())

const configurationStorage = new SessionConfigurationStorage()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('[background request]', request)
  if (isContentPageGravityRequest(request)) {
    onContentPageGravityRequest(request).then(sendResponse)
    return true
  }
})

async function onContentPageGravityRequest({
  gdc_subject: subject,
}: GravityContentPageRequest): Promise<
  undefined | GravityResponse<Partial<CollectorOptions>>
> {
  switch (subject) {
    case GravityContentPageRequestSubject.RUNNING_CONFIGURATION: {
      return configurationStorage
        .getState()
        .then((state: CollectorState | null) => {
          if (state !== CollectorState.RUNNING) {
            console.log('[background response] undefined')
            return undefined
          }
          return configurationStorage.getOptions().then((options) => {
            if (options) {
              const response = { data: options, error: null }
              console.log('[background response]', response)
              return response
            }
            console.log('[background response] undefined')
            return undefined
          })
        })
    }
  }
  console.log('[background response] undefined')
  return undefined
}
