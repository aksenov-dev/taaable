import { onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

import { useEventListener } from '@vueuse/core'

export function useAutoInputWidth(inputRef: Ref<HTMLInputElement | null>, isEnabled: MaybeRefOrGetter<boolean>) {
  const clearEventListenerFn = ref<() => void>()

  const updateWidth = () => {
    const input = inputRef.value

    if (!input) return

    const inputStyle = getComputedStyle(input)
    const hiddenSpan = document.createElement('span')

    hiddenSpan.style.position = 'absolute'
    hiddenSpan.style.top = '-9999px'
    hiddenSpan.style.left = '-9999px'
    hiddenSpan.style.whiteSpace = 'pre'
    hiddenSpan.style.visibility = 'hidden'
    hiddenSpan.style.pointerEvents = 'none'
    hiddenSpan.style.font = inputStyle.font
    hiddenSpan.style.letterSpacing = inputStyle.letterSpacing
    hiddenSpan.style.textTransform = inputStyle.textTransform
    hiddenSpan.style.padding = inputStyle.padding
    hiddenSpan.style.border = inputStyle.border

    hiddenSpan.textContent = input.value || input.placeholder || ''

    document.body.appendChild(hiddenSpan)
    input.style.width = `${hiddenSpan.offsetWidth + 2}px`
    document.body.removeChild(hiddenSpan)
  }

  const resetInputWidth = () => {
    if (!inputRef.value) return
    inputRef.value.style.width = ''
  }

  onMounted(() => {
    watch(() => toValue(isEnabled), isEnabled => {
      if (isEnabled) {
        updateWidth()
        setTimeout(updateWidth, 50) // initial render bug 🪲
        clearEventListenerFn.value = useEventListener(inputRef, 'input', updateWidth)
      } else {
        if (clearEventListenerFn.value) clearEventListenerFn.value()
        resetInputWidth()
      }
    }, { immediate: true })
  })

  return {
    updateWidth
  }
}
