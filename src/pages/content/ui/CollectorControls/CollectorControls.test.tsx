import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CollectorControls from '@pages/content/ui/CollectorControls/CollectorControls'
import collectorConfigurationStorage from '@src/shared/storages/CollectorConfigurationStorage'
import { actRender } from '@pages/test-utils/actRender'

describe('CollectorControls', function () {
  it('should not display controls if no collector configured', async function () {
    await actRender(<CollectorControls />)
    expect(
      screen.queryByTestId('gdc-controls-container'),
    ).not.toBeInTheDocument()
  })

  it('should display expand/collapse button if collector configured', async function () {
    await collectorConfigurationStorage.save({ debug: true })
    const { user } = await actRender(<CollectorControls />)
    await user.click(screen.getByTestId('gdc-expand'))
    expect(screen.queryByTestId('gdc-controls')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('gdc-expand'))
    expect(screen.getByTestId('gdc-controls')).toBeInTheDocument()
  })
})
