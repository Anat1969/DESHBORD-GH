/**
 * כלל Prose של ענת:
 * פסיק = שורה חדשה (br)
 * נקודה = פסקה עם רווח אחריה
 *
 * לא חל על מספרים (22,565) או מקטעי סעיף (4.1.2)
 * שומר רווח לפני שבירת השורה כדי שטקסט מועתק ישאר שלם
 */
export function proseFormat(text) {
  if (!text) return ''
  // Replace ", " (comma+space) with " \n" — but NOT inside numbers (digit,digit)
  let result = text.replace(/(\D), /g, '$1, \n')
  // Replace ". " (period+space) with ".\n\n" — but NOT inside numbers (digit.digit)
  result = result.replace(/(\D)\. /g, '$1.\n\n')
  return result
}

/**
 * React component version — converts prose text to JSX with <br/> and spacing
 */
export function ProseText({ text, className }) {
  if (!text) return null
  const formatted = proseFormat(text)
  const parts = formatted.split('\n')

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (part === '' ? null : <br />)}
        </span>
      ))}
    </span>
  )
}
