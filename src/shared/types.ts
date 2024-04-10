import { CollectorOptions } from '@smartesting/gravity-data-collector'

export type CollectorConfiguration = {
  isRunning: boolean
  options: Partial<CollectorOptions>
}

export type GravityResponse<Data> =
  | {
      data: Data
      error?: undefined
    }
  | {
      data?: undefined
      error: string
    }
