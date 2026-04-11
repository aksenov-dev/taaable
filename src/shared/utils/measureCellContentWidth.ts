export function measureCellContentWidth(cellEl: HTMLElement): number {
  const COLUMN_WIDTH_PADDING_FIX = 2

  const range = document.createRange()
  range.selectNodeContents(cellEl)

  const rect = range.getBoundingClientRect()

  const style = window.getComputedStyle(cellEl)
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0
  const paddingRight = Number.parseFloat(style.paddingRight) || 0

  return rect.width + paddingLeft + paddingRight + COLUMN_WIDTH_PADDING_FIX
}
