import { useEffect, useMemo, useState } from 'react'
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

const loadingStats = [
  { label: 'XR-17', value: 'A9F' },
  { label: 'NULL', value: 'K2M' },
  { label: 'VX-04', value: 'Q8Z' },
]

function MarqueeLine({ as: Tag = 'div', items, className, direction, strongItems = [] }) {
  const renderItems = (suffix) =>
    items.map((item, index) => (
      <span
        key={`${item}-${suffix}-${index}`}
        className={strongItems.includes(item) ? 'micro-strong' : undefined}
      >
        {item}
      </span>
    ))

  return (
    <Tag className={`marquee-row ${direction} ${className}`}>
      <span className="marquee-track">
        <span className="marquee-sequence">{renderItems('a')}</span>
        <span className="marquee-sequence" aria-hidden="true">
          {renderItems('b')}
        </span>
        <span className="marquee-sequence" aria-hidden="true">
          {renderItems('c')}
        </span>
      </span>
    </Tag>
  )
}

function App() {
  const [progress, setProgress] = useState(8)
  const [isReady, setIsReady] = useState(false)
  const [hideLoader, setHideLoader] = useState(false)

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

  const computedStats = useMemo(
    () => [
      loadingStats[0],
      { label: 'PCT', value: `${String(Math.min(100, Math.round(progress))).padStart(3, '0')}%` },
      loadingStats[1],
      loadingStats[2],
    ],
    [progress],
  )

  return (
    <main className="poster-shell">
      {!hideLoader && (
        <section className={`loading-screen${isReady ? ' is-ready' : ''}`}>
          <div className="loading-panel">
            <div className="loading-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="loading-meta" aria-label="Loading stats">
              {computedStats.map((item, index) => (
                <span key={item.label}>
                  {index > 0 ? ' / ' : ''}
                  {item.label} {item.value}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}
      <section className="poster">
        <MarqueeLine as="h1" items={heroTop} className="hero-line hero-top" direction="to-right" />
        <MarqueeLine
          as="h2"
          items={heroBottom}
          className="hero-line hero-bottom"
          direction="to-left"
        />
        <div className="info-block">
          <div className="rule" />
          <MarqueeLine
            as="p"
            items={topRibbon}
            className="micro-line"
            direction="to-right"
            strongItems={['SILENCIO', 'FILMS']}
          />
          <div className="rule" />
          <MarqueeLine
            as="p"
            items={taglineRibbon}
            className="tagline"
            direction="to-left"
          />
          <div className="rule" />
          <MarqueeLine
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
