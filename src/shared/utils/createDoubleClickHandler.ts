export function createDoubleClickHandler(onDouble: () => void, onSingle: (event: MouseEvent) => void, delay = 300) {
  let lastClickTime = 0

  return (event: MouseEvent) => {
    const now = Date.now()

    if (now - lastClickTime < delay) {
      onDouble()
    }
    else {
      onSingle(event)
    }

    lastClickTime = now
  }
}
