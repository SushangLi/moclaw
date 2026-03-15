import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const MAX_LINES = 500

export default function LogViewer({ lines }: { lines: string[] }): React.JSX.Element {
  const { t } = useTranslation('management')
  const bottomRef = useRef<HTMLDivElement>(null)
  const displayLines = lines.length > MAX_LINES ? lines.slice(-MAX_LINES) : lines
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayLines.length])

  const handleCopy = async (): Promise<void> => {
    const text = lines.join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card !rounded-xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-error/60" />
          <div className="w-2 h-2 rounded-full bg-warning/60" />
          <div className="w-2 h-2 rounded-full bg-success/60" />
          <span className="ml-2 text-[10px] text-text-muted/50 font-mono">output</span>
        </div>
        <button
          onClick={handleCopy}
          disabled={lines.length === 0}
          className="text-[10px] text-text-muted/50 hover:text-primary/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {copied ? t('logViewer.copied') || '✓ Copied' : t('logViewer.copy') || 'Copy'}
        </button>
      </div>

      <div className="p-3 h-32 overflow-y-auto font-mono text-[11px] leading-5 text-text-muted">
        {displayLines.length === 0 && (
          <span className="opacity-40 italic">{t('logViewer.waiting')}</span>
        )}
        {displayLines.map((line, i) => (
          <div key={i} className="break-all hover:text-text/80 transition-colors">
            <span className="text-primary/30 mr-2 select-none">&gt;</span>
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
