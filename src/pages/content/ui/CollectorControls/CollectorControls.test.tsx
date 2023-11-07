import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import CollectorControls from '@pages/content/ui/CollectorControls/CollectorControls'

describe('CollectorControls', function () {
  it('should display expand/collapse button', async function () {
    render(<CollectorControls />)
    await userEvent.click(screen.getByTestId('gdc-expand'))
    expect(screen.queryByTestId('gdc-controls')).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('gdc-expand'))
    expect(screen.getByTestId('gdc-controls')).toBeInTheDocument()
  })
})
