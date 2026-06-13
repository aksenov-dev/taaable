export interface CellStyle {
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
  backgroundColor?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
}

export type TextFormatKey = 'bold' | 'italic' | 'strikethrough'
