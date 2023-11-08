import { CollectorOptions } from '@smartesting/gravity-data-collector'

export type CollectorConfiguration = {
  isRunning: boolean
  options: Partial<CollectorOptions>
}

export type GravityResponse<DATA> = {
  error: string | null
  data: DATA | null
}
