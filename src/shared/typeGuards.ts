import {
  GravityContentPageRequest,
  GravityPopupRequest,
} from '@src/shared/types'

export function isPopupGravityRequest(
  request: unknown,
): request is GravityPopupRequest {
  const gravityRequest = request as GravityPopupRequest
  return gravityRequest.gdc_driverCommand !== undefined
}

export function isContentPageGravityRequest(
  request: unknown,
): request is GravityContentPageRequest {
  const gravityRequest = request as GravityContentPageRequest
  return gravityRequest.gdc_subject !== undefined
}
