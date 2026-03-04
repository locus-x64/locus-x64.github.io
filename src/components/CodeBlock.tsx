import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import cpp from 'highlight.js/lib/languages/cpp'
import c from 'highlight.js/lib/languages/c'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import { Copy, Check } from '@phosphor-icons/react'
import { useState } from 'react'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', c)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'plaintext' }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className="code-block-wrapper group relative my-7">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest px-2 py-1 bg-secondary/50 rounded border border-border/30">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 border border-border/50"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} weight="bold" className="text-accent" />
              <span className="text-accent">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="code-block overflow-x-auto">
        <div className="flex">
          <div className="select-none text-muted-foreground/40 pr-4 text-right border-r border-border/30 font-mono text-xs leading-[1.6] pt-1">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="!bg-transparent !p-0 !m-0 flex-1 pl-4">
            <code 
              ref={codeRef} 
              className={`language-${language} !bg-transparent block`}
            >
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
