import { CollectorOptions } from '@smartesting/gravity-data-collector'
import { CollectorConfiguration } from '@src/shared/types'
import { createStorage, IStorage } from '@src/shared/storages/IStorage'
import { DEFAULT_COLLECTOR_CONFIGURATION } from '@src/shared/constants'

type CollectorConfigurationStorage = IStorage<CollectorConfiguration> & {
  start: () => Promise<CollectorConfiguration>
  stop: () => Promise<CollectorConfiguration>
  save: (options: Partial<CollectorOptions>) => Promise<CollectorConfiguration>
}

const base: IStorage<CollectorConfiguration> =
  createStorage<CollectorConfiguration>(
    'gravity-configuration-storage-key',
    DEFAULT_COLLECTOR_CONFIGURATION
  )

const collectorConfigurationStorage: CollectorConfigurationStorage = {
  ...base,
  start: async (): Promise<CollectorConfiguration> => {
    return base.set((previousConfiguration) => {
      return {
        ...previousConfiguration,
        isRunning: true
      }
    })
  },

  stop: async (): Promise<CollectorConfiguration> => {
    return base.set((previousConfiguration) => {
      return {
        ...previousConfiguration,
        isRunning: false
      }
    })
  },

  save: async (
    options: Partial<CollectorOptions>
  ): Promise<CollectorConfiguration> => {
    return base.set((previousConfiguration) => {
      return {
        ...previousConfiguration,
        options
      }
    })
  }
}

export default collectorConfigurationStorage
