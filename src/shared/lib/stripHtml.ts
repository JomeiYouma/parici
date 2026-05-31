/**
 * Retire les balises HTML mais préserve la STRUCTURE : les `<br>` et les
 * fermetures de blocs deviennent des sauts de ligne (les textes open data
 * séparent leurs lignes par des `<br />`). À afficher en `whitespace-pre-line`.
 */
export function stripHtml(html: string | null): string {
  if (!html) return ''
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|tr|h[1-6]|ul|ol)\s*>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/[^\S\n]+/g, ' ') // espaces/tabs → 1 espace, mais garde les \n
    .replace(/ *\n */g, '\n') // retire les espaces autour des sauts de ligne
    .replace(/\n{3,}/g, '\n\n') // au plus 2 sauts consécutifs
    .trim()
}
