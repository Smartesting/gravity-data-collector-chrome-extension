import { CollectorOptions } from '@smartesting/gravity-data-collector'

export enum CollectorState {
  STOPPED = 'STOPPED',
  RUNNING = 'RUNNING',
}

export enum CollectorDriverCommand {
  START = 'START',
  STOP = 'STOP',
}

export type GravityRequest = GravityPopupRequest | GravityContentPageRequest

export type GravityPopupRequest = {
  gdc_driverCommand: CollectorDriverCommand
  gdc_collectorOptions?: Partial<CollectorOptions>
}

export enum GravityContentPageRequestSubject {
  RUNNING_CONFIGURATION = 'runningConfiguration',
}

export type GravityContentPageRequest = {
  gdc_subject: GravityContentPageRequestSubject
}

export type GravityResponse<DATA> = {
  error: string | null
  data: DATA | null
}
