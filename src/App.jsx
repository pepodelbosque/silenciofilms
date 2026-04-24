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

const heroTop = repeatItems(['SILENCIO'], 8)
const heroBottom = repeatItems(['FILMS', 'VIDEO', 'GAMES'], 6)
const topRibbon = repeatItems(topRibbonBase, 4)
const taglineRibbon = repeatItems(
  ['PRODUCTORA LATINOAMERICANA DE EXPERIENCIAS FILMICAS'],
  4,
)
const bottomRibbon = repeatItems(bottomRibbonBase, 3)

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
      <div className="marquee-track">
        <span className="marquee-sequence">{renderItems('a')}</span>
        <span className="marquee-sequence" aria-hidden="true">
          {renderItems('b')}
        </span>
      </div>
    </Tag>
  )
}

function App() {
  return (
    <main className="poster-shell">
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
