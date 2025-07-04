import DOMPurify from 'dompurify'

export const sanitizeHtml = (dirtyHtml: string): string => {
  return DOMPurify.sanitize(dirtyHtml)

  // return DOMPurify.sanitize(dirtyHtml, {
  //   ALLOWED_TAGS: ['br', 'span'],
  //   ALLOWED_ATTR: ['style']
  // })
}
