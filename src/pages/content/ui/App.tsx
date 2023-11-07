import CollectorControls from '@pages/content/ui/CollectorControls/CollectorControls'
import EmotionCacheProvider from '@pages/content/emotion/EmotionCacheProvider'
import ResetStyleProvider from '@pages/content/emotion/ResetStyleProvider'
import FontProvider from '@pages/content/emotion/FontProvider'

export default function App() {
  return (
    <ResetStyleProvider>
      <FontProvider>
        <EmotionCacheProvider>
          <CollectorControls />
        </EmotionCacheProvider>
      </FontProvider>
    </ResetStyleProvider>
  )
}
