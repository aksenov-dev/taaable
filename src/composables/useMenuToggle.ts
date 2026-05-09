import { ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'

export function useMenuToggle() {
  const isMenuOpen = ref(false)

  const toggleMenu = useThrottleFn(() => {
    isMenuOpen.value = !isMenuOpen.value
  }, 200)

  return {
    isMenuOpen,
    toggleMenu,
  }
}
