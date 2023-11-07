import { createRoot } from 'react-dom/client'
import refreshOnUpdate from 'virtual:reload-on-update-in-view'
import { ROOT_ID } from '@pages/content/constants'
import App from '@pages/content/ui/App'

refreshOnUpdate('pages/content/ui')

const root = document.createElement('div')
root.id = ROOT_ID

document.body.prepend(root)

const rootIntoShadow = document.createElement('div')
rootIntoShadow.id = 'shadow-root'

const shadowRoot = root.attachShadow({ mode: 'open' })
shadowRoot.prepend(rootIntoShadow)

createRoot(rootIntoShadow).render(<App />)
