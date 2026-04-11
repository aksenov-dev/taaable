import DOMPurify from 'dompurify'

export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml)

  // return DOMPurify.sanitize(dirtyHtml, {
  //   ALLOWED_TAGS: ['br', 'span'],
  //   ALLOWED_ATTR: ['style']
  // })
}
