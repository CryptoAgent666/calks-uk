import { useState, useEffect } from 'react'

/**
 * Shareable-calculation helpers.
 *
 * useUrlParam(key, fallback) — a useState that applies a query-string override
 * AFTER mount, so a shared link restores the exact calculation. Reading the URL
 * in the initial state would make the first client render differ from the
 * SSR'd HTML and trigger a React hydration mismatch (#418) — always apply URL
 * state in an effect.
 *
 * <ShareRow params={{salary, pension}} /> — "Copy link" / native share buttons
 * that encode the CURRENT inputs into the page URL on click (no history spam
 * while typing).
 */
export function useUrlParam(key: string, fallback: string): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState(fallback)
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get(key)
    // Calculator inputs are short numbers/ids — cap length to keep things sane.
    if (v !== null && v !== '') setValue(v.slice(0, 40))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [value, setValue]
}

function buildUrl(params: Record<string, string>): string {
  const url = new URL(window.location.href)
  url.search = ''
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v != null) url.searchParams.set(k, v)
  }
  return url.toString()
}

export default function ShareRow({ params }: { params: Record<string, string> }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const link = buildUrl(params)
    history.replaceState(null, '', link)
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable (http/permissions) — URL bar now holds the link */
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const share = async () => {
    const link = buildUrl(params)
    history.replaceState(null, '', link)
    try {
      await navigator.share({ title: document.title, url: link })
    } catch {
      /* user dismissed the sheet */
    }
  }

  const canShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="Copy a link to this calculation"
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Copied
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            Copy link to this calculation
          </>
        )}
      </button>
      {canShare && (
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Share this calculation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
          Share
        </button>
      )}
    </div>
  )
}
