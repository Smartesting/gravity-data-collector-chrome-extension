import { CollectorConfiguration } from '@src/shared/types'

export enum GravityServerUrls {
  STAGING = 'https://gravity-api-staging.osc-fr1.scalingo.io',
  PRODUCTION = 'https://gravity-api-production.osc-fr1.scalingo.io',
  LOCAL = 'http://localhost:3000',
}

export const DEFAULT_GRAVITY_SERVER_URL = GravityServerUrls.LOCAL

export const DEFAULT_COLLECTOR_CONFIGURATION: CollectorConfiguration = {
  isRunning: false,
  options: {
    gravityServerUrl: DEFAULT_GRAVITY_SERVER_URL,
    debug: true,
    authKey: '',
  },
}
