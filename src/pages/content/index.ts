console.log('Load Gravity Data Collector content')

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./dataCollector')
