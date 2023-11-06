import { CollectorOptions } from '@smartesting/gravity-data-collector'
import { CollectorState } from '@src/shared/types'

export default interface IConfigurationStorage {
  saveState(state: CollectorState): Promise<void>

  saveOptions(options: Partial<CollectorOptions>): Promise<void>

  getState(): Promise<CollectorState | null>

  getOptions(): Promise<Partial<CollectorOptions> | null>
}
