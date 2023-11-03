// eslint-disable-next-line import/no-duplicates
import GravityCollector from '@smartesting/gravity-data-collector/dist'
// eslint-disable-next-line import/no-duplicates
import { CollectorOptions } from '@smartesting/gravity-data-collector'

const options: Partial<CollectorOptions> = { debug: true }
console.log('Initialize Gravity Data Collector with', options)
GravityCollector.init(options)
