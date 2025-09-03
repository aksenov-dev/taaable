export const createResizeMask = (direction: 'row' | 'column'): void => {
  const mask = document.createElement('div')

  mask.classList.add(
    'resize-mask',
    'fixed',
    'inset-0',
    'z-[9999]',
    direction === 'row' ? 'cursor-row-resize' : 'cursor-col-resize'
  )

  document.body.appendChild(mask)
}

export const removeResizeMask = (): void => {
  const mask = document.querySelector('.resize-mask')
  if (mask) mask.remove()
}
