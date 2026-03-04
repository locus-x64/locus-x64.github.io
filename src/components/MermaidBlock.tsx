import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

interface MermaidBlockProps {
  chart: string
}

const MERMAID_THEME = {
  theme: 'base' as const,
  themeVariables: {
    // Background & surfaces
    background: '#0a0c14',
    mainBkg: '#121620',
    secondBkg: '#1a1e2e',
    tertiaryColor: '#1a1e2e',

    // Text
    primaryTextColor: '#e0e2e8',
    secondaryTextColor: '#b0b4c0',
    tertiaryTextColor: '#b0b4c0',
    textColor: '#e0e2e8',

    // Primary (green accent from theme --primary: oklch(0.65 0.19 145))
    primaryColor: '#2a9d6a',
    primaryBorderColor: '#3dbf82',

    // Secondary
    secondaryColor: '#1e2234',
    secondaryBorderColor: '#2e3348',

    // Lines & borders
    lineColor: '#3dbf82',
    border1: '#2e3348',
    border2: '#3dbf82',

    // Notes
    noteBkgColor: '#1e2234',
    noteTextColor: '#e0e2e8',
    noteBorderColor: '#3dbf82',

    // Labels
    labelColor: '#e0e2e8',
    labelTextColor: '#e0e2e8',
    labelBoxBkgColor: '#121620',
    labelBoxBorderColor: '#2e3348',

    // Actors (sequence diagrams)
    actorBkg: '#121620',
    actorBorder: '#3dbf82',
    actorTextColor: '#e0e2e8',
    actorLineColor: '#3dbf82',

    // Signals (sequence diagrams)
    signalColor: '#e0e2e8',
    signalTextColor: '#e0e2e8',

    // Loops
    loopTextColor: '#e0e2e8',

    // Activation (sequence diagrams)
    activationBkgColor: '#1a1e2e',
    activationBorderColor: '#3dbf82',

    // Sequence numbers
    sequenceNumberColor: '#0a0c14',

    // Flowchart
    nodeBkg: '#121620',
    nodeBorder: '#3dbf82',
    clusterBkg: '#0e1018',
    clusterBorder: '#2e3348',
    defaultLinkColor: '#3dbf82',
    edgeLabelBackground: '#121620',

    // Fonts
    fontFamily: "'JetBrains Mono', 'Inter', monospace",
    fontSize: '14px',

    // Error
    errorBkgColor: '#3a1520',
    errorTextColor: '#ff6b6b',

    // Pie
    pie1: '#3dbf82',
    pie2: '#d4855a',
    pie3: '#6a8fd8',
    pie4: '#c76a9f',
    pieStrokeColor: '#2e3348',
    pieTitleTextColor: '#e0e2e8',
    pieSectionTextColor: '#0a0c14',
    pieStrokeWidth: '1px',

    // Class diagram
    classText: '#e0e2e8',

    // State
    fillType0: '#121620',
    fillType1: '#1a1e2e',
    fillType2: '#1e2234',
  },
}

let mermaidInitialized = false

function initMermaid() {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      ...MERMAID_THEME,
      securityLevel: 'loose',
      logLevel: 'fatal',
      fontFamily: "'JetBrains Mono', 'Inter', monospace",
    })
    mermaidInitialized = true
  }
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const uniqueId = useId().replace(/:/g, '_')

  useEffect(() => {
    let cancelled = false
    initMermaid()

    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${uniqueId}`,
          chart.trim()
        )
        if (!cancelled) {
          setSvg(renderedSvg)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setSvg('')
        }
      }
    }

    renderChart()
    return () => { cancelled = true }
  }, [chart, uniqueId])

  if (error) {
    return (
      <div className="my-7 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
        <p className="text-sm text-destructive font-mono">Mermaid diagram error: {error}</p>
        <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">{chart}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-7 flex items-center justify-center p-8 rounded-lg border border-border/50 bg-card/30">
        <div className="animate-pulse text-muted-foreground text-sm">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <div className="my-7 overflow-x-auto rounded-lg border border-border/50 bg-card/30 p-6">
      <div
        ref={containerRef}
        className="flex justify-center [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
