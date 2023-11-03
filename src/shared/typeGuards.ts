import { GravityRequest } from '@src/shared/types'

export function isGravityRequest(request: unknown): request is GravityRequest {
  const gravityRequest = request as GravityRequest
  return gravityRequest.gdc_driverCommand !== undefined
}
