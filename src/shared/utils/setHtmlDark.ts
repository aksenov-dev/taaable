export const setHtmlDark = (value: boolean): void => {
  document.documentElement.classList.add('theme-switching')
  requestAnimationFrame(() => document.documentElement.classList.remove('theme-switching'))

  if (value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
