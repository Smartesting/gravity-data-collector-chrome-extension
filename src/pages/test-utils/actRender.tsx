import React from 'react'
import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export async function actRender(reactElement: React.ReactElement) {
  return await act(async () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const rendering = await render(reactElement)
    return {
      user: userEvent.setup(),
      ...rendering,
    }
  })
}
