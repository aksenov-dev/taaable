export interface Props {
  variant: 'search' | 'title' | 'title-preview' | 'sheet' | 'font-size' | 'range' | 'formula'
  type?: 'text' | 'number' | 'password'
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  autoWidth?: boolean
}
