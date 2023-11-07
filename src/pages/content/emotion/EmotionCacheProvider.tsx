import createCache from '@emotion/cache'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/react/types'
import { ROOT_ID } from '@pages/content/constants'

export default function EmotionCacheProvider({
  children,
}: {
  children: ReactNode
}) {
  const shadowRootRef = useRef<HTMLDivElement>(null)
  const [emotionCache, setEmotionCache] = useState<EmotionCache>()

  useEffect(() => {
    const root = document.getElementById(ROOT_ID)
    if (root && root.shadowRoot) {
      setEmotionStyles(root)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shadowRootRef.current?.shadowRoot])

  function setEmotionStyles(ref: HTMLElement) {
    if (!ref?.shadowRoot) {
      return
    }

    if (ref && !emotionCache) {
      const createdInflabEmotionWithRef = createCache({
        key: 'gravity-data-collector-chrome-extension',
        container: ref.shadowRoot,
      })

      setEmotionCache(createdInflabEmotionWithRef)
    }
  }

  return (
    <div id='root' ref={shadowRootRef}>
      {emotionCache && (
        <CacheProvider value={emotionCache}>{children}</CacheProvider>
      )}
    </div>
  )
}
