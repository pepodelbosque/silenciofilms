import { useEffect, useMemo, useRef, useState } from 'react'
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

const heroTop = repeatItems(['SILENCIO'], 14)
const heroBottom = repeatItems(['FILMS', 'VIDEO', 'GAMES'], 10)
const topRibbon = repeatItems(topRibbonBase, 10)
const taglineRibbon = repeatItems(
  ['PRODUCTORA LATINOAMERICANA DE EXPERIENCIAS FILMICAS'],
  8,
)
const bottomRibbon = repeatItems(bottomRibbonBase, 8)

function MarqueeLine({ as: Tag = 'div', items, className, direction, strongItems = [] }) {
  const rowRef = useRef(null)
  const sequenceRef = useRef(null)
  const [sequenceWidth, setSequenceWidth] = useState(0)
  const [copyCount, setCopyCount] = useState(3)

  const renderItems = (suffix) =>
    items.map((item, index) => (
      <span
        key={`${item}-${suffix}-${index}`}
        className={strongItems.includes(item) ? 'micro-strong' : undefined}
      >
        {item}
      </span>
    ))

  useEffect(() => {
    const rowElement = rowRef.current
    const sequenceElement = sequenceRef.current

    if (!rowElement || !sequenceElement) {
      return undefined
    }

    let frameId = 0

    const updateMeasurements = () => {
      frameId = 0

      const nextRowWidth = rowElement.getBoundingClientRect().width
      const nextSequenceWidth = sequenceElement.getBoundingClientRect().width

      if (!nextRowWidth || !nextSequenceWidth) {
        return
      }

      const nextCopyCount = Math.max(3, Math.ceil(nextRowWidth / nextSequenceWidth) + 2)

      setSequenceWidth((currentWidth) =>
        Math.abs(currentWidth - nextSequenceWidth) > 0.5 ? nextSequenceWidth : currentWidth,
      )
      setCopyCount((currentCount) =>
        currentCount !== nextCopyCount ? nextCopyCount : currentCount,
      )
    }

    const scheduleUpdate = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      frameId = window.requestAnimationFrame(updateMeasurements)
    }

    scheduleUpdate()

    const resizeObserver =
      'ResizeObserver' in window ? new window.ResizeObserver(scheduleUpdate) : null

    resizeObserver?.observe(rowElement)
    resizeObserver?.observe(sequenceElement)
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      resizeObserver?.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [items])

  const sequences = useMemo(() => Array.from({ length: copyCount }, (_, index) => index), [copyCount])

  return (
    <Tag ref={rowRef} className={`marquee-row ${direction} ${className}`}>
      <span
        className="marquee-track"
        style={sequenceWidth ? { '--shift': `${sequenceWidth}px` } : undefined}
      >
        {sequences.map((sequenceIndex) => (
          <span
            key={`sequence-${sequenceIndex}`}
            ref={sequenceIndex === 0 ? sequenceRef : undefined}
            className="marquee-sequence"
            aria-hidden={sequenceIndex > 0 ? 'true' : undefined}
          >
            {renderItems(sequenceIndex)}
          </span>
        ))}
      </span>
    </Tag>
  )
}

function App() {
  const [progress, setProgress] = useState(8)
  const [isReady, setIsReady] = useState(false)
  const [hideLoader, setHideLoader] = useState(false)
  const [marqueeResetKey, setMarqueeResetKey] = useState(0)

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
        'fonts' in document ? document.fonts.ready : Promise.resolve()

      if (document.readyState !== 'complete') {
        await new Promise((resolve) => {
          window.addEventListener('load', resolve, { once: true })
        })
      }

      await fontPromise
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, 5000 - elapsed)

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
    <main className="poster-shell">
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
      </section>
    </main>
  )
}

export default App
