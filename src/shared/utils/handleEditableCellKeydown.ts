export const handleEditableCellKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    e.stopPropagation()

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return

    const range = selection.getRangeAt(0)

    const br = document.createElement('br')
    const space = document.createTextNode('\u200B')

    range.insertNode(space)
    range.insertNode(br)

    range.setStartAfter(br)
    range.collapse(true)

    selection.removeAllRanges()
    selection.addRange(range)
  }
}
