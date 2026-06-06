import { memo, useEffect, useMemo, useState } from 'react'
import './App.css'

const topRibbonBase = [
  'SILENCIO',
  'VIDEOGAMES',
  'FILMS',
  'ANIMATIONS',
]

const bottomRibbonBase = [
  'CINEMATIC',
  'FRAMERATE',
  'LORE',
  'CUTSCENE',
  'PIXELS',
  'SOUNDTRACK',
  'NEON',
  'CAMERA',
  'BOSSFIGHT',
  'MONTAGE',
]

const repeatItems = (items, count) => Array.from({ length: count }, () => items).flat()

const heroTop = repeatItems(['SILENCIO'], 22)
const heroBottom = repeatItems(['FILMS', 'VIDEO', 'GAMES'], 18)
const topRibbon = repeatItems(topRibbonBase, 18)
const taglineRibbon = repeatItems(
  ['PRODUCTORA LATINOAMERICANA DE EXPERIENCIAS FILMICAS'],
  14,
)
const bottomRibbon = repeatItems(bottomRibbonBase, 14)
const MOBILE_READY_TIMEOUT = 1600
const MIN_LOADER_MS = 1800

const waitWithTimeout = (promise, timeoutMs) =>
  Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs)
    }),
  ])

const MarqueeLine = memo(function MarqueeLine({
  as: Tag = 'div',
  items,
  className,
  direction,
  strongItems = [],
}) {
  const renderedSequences = useMemo(() => {
    const renderItems = (suffix) =>
      items.map((item, index) => (
        <span
          key={`${item}-${suffix}-${index}`}
          className={strongItems.includes(item) ? 'micro-strong' : undefined}
        >
          {item}
        </span>
      ))

    return [renderItems('a'), renderItems('b'), renderItems('c')]
  }, [items, strongItems])

  return (
    <Tag className={`marquee-row ${direction} ${className}`}>
      <span className="marquee-track">
        <span className="marquee-sequence">{renderedSequences[0]}</span>
        <span className="marquee-sequence" aria-hidden="true">
          {renderedSequences[1]}
        </span>
        <span className="marquee-sequence" aria-hidden="true">
          {renderedSequences[2]}
        </span>
      </span>
    </Tag>
  )
})

function App() {
  const [progress, setProgress] = useState(8)
  const [isReady, setIsReady] = useState(false)
  const [hideLoader, setHideLoader] = useState(false)
  const [marqueeResetKey, setMarqueeResetKey] = useState(0)
  const [isInverted, setIsInverted] = useState(false)

  useEffect(() => {
    const resetMarquee = () => {
      setMarqueeResetKey(Date.now())
    }

    resetMarquee()
    window.addEventListener('pageshow', resetMarquee)

    return () => {
      window.removeEventListener('pageshow', resetMarquee)
    }
  }, [])

  const toggleInverted = () => {
    setIsInverted((current) => !current)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleInverted()
    }
  }

  useEffect(() => {
    let progressTimer
    let hideTimer
    let mounted = true
    const startedAt = Date.now()

    const advanceProgress = () => {
      progressTimer = window.setInterval(() => {
        setProgress((current) => {
          if (current >= 94) {
            window.clearInterval(progressTimer)
            return current
          }

          return Math.min(94, current + Math.max(1, (100 - current) * 0.045))
        })
      }, 140)
    }

    const waitForReady = async () => {
      const fontPromise =
        'fonts' in document ? waitWithTimeout(document.fonts.ready, MOBILE_READY_TIMEOUT) : Promise.resolve()

      if (document.readyState !== 'complete') {
        await waitWithTimeout(
          new Promise((resolve) => {
            window.addEventListener('load', resolve, { once: true })
          }),
          MOBILE_READY_TIMEOUT,
        )
      }

      await fontPromise
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed)

      if (remaining > 0) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, remaining)
        })
      }

      if (!mounted) {
        return
      }

      window.clearInterval(progressTimer)
      setProgress(100)
      setIsReady(true)
      hideTimer = window.setTimeout(() => {
        if (mounted) {
          setHideLoader(true)
        }
      }, 520)
    }

    advanceProgress()
    waitForReady()

    return () => {
      mounted = false
      window.clearInterval(progressTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <main
      className={`poster-shell${isInverted ? ' is-inverted' : ''}`}
      onPointerDown={toggleInverted}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isInverted}
      aria-label="Toggle inverted colors"
    >
      {!hideLoader && (
        <section className={`loading-screen${isReady ? ' is-ready' : ''}`}>
          <div className="loading-panel">
            <div className="loading-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-meta" aria-label="Loading percentage">
              {String(Math.min(100, Math.round(progress))).padStart(3, '0')}%
            </p>
          </div>
        </section>
      )}
      <section className="poster">
        <div className="poster-space poster-space--top" data-space-name="ESPACIO1" aria-hidden="true" />
        <div className="poster-content">
          <MarqueeLine
            key={`hero-top-${marqueeResetKey}`}
            as="h1"
            items={heroTop}
            className="hero-line hero-top"
            direction="to-right"
          />
          <MarqueeLine
            key={`hero-bottom-${marqueeResetKey}`}
            as="h2"
            items={heroBottom}
            className="hero-line hero-bottom"
            direction="to-left"
          />
          <div className="info-block">
            <div className="rule" />
            <MarqueeLine
              key={`top-ribbon-${marqueeResetKey}`}
              as="p"
              items={topRibbon}
              className="micro-line"
              direction="to-right"
              strongItems={['SILENCIO', 'FILMS']}
            />
            <div className="rule" />
            <MarqueeLine
              key={`tagline-${marqueeResetKey}`}
              as="p"
              items={taglineRibbon}
              className="tagline"
              direction="to-left"
            />
            <div className="rule" />
            <MarqueeLine
              key={`bottom-ribbon-${marqueeResetKey}`}
              as="p"
              items={bottomRibbon}
              className="micro-line micro-line--footer"
              direction="to-right"
            />
          </div>
        </div>
        <div className="poster-space poster-space--bottom" data-space-name="ESPACIO2" aria-hidden="true" />
      </section>
    </main>
  )
}

export default App
