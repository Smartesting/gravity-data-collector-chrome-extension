import { CollectorOptions } from '@smartesting/gravity-data-collector'
import { CollectorState } from '@src/shared/types'
import IConfigurationStorage from '@src/shared/IConfigurationStorage'

enum SessionStorageKeys {
  OPTIONS = 'gdc_options',
  STATE = 'gdc_state',
}

export default class SessionConfigurationStorage
  implements IConfigurationStorage
{
  async getOptions(): Promise<Partial<CollectorOptions> | null> {
    return chrome.storage.session
      .get(SessionStorageKeys.OPTIONS)
      .then((response) => {
        if (response.gdc_options) {
          const { authKey, gravityServerUrl, debug } = response.gdc_options
          return {
            authKey,
            gravityServerUrl,
            debug,
          }
        }
        return null
      })
  }

  getState(): Promise<CollectorState | null> {
    return chrome.storage.session
      .get(SessionStorageKeys.STATE)
      .then((response) => {
        return response.gdc_state ? response.gdc_state : null
      })
  }

  saveOptions(options: Partial<CollectorOptions>): Promise<void> {
    return chrome.storage.session.set({ [SessionStorageKeys.OPTIONS]: options })
  }

  saveState(state: CollectorState): Promise<void> {
    return chrome.storage.session.set({ [SessionStorageKeys.STATE]: state })
  }
}
