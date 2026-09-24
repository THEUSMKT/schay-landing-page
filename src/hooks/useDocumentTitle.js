import { useEffect } from 'react'

/** Mantém <title> (aba do navegador / histórico) correto por rota. */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}
