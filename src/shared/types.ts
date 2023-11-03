import { CollectorOptions } from '@smartesting/gravity-data-collector'

export enum CollectorState {
  STOPPED = 'STOPPED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
}

export enum CollectorDriverCommand {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
}

export type GravityRequest = {
  gdc_driverCommand: CollectorDriverCommand
  gdc_collectorOptions: Partial<CollectorOptions>
}

export type GravityResponse<DATA> = {
  error: string | null
  data: DATA | null
}
