import type { CellStyle } from '@/shared/types'

export interface Cell {
  cellId: string // Уникальный ID (например "A1" или "row-1-col-2")
  sheetId: string // ← связь с Sheet
  rowId: string
  columnId: string
  value: string | number // Основное содержимое
  type?: 'text' | 'formula' // Тип содержимого
  formula?: string // Если ячейка вычисляемая
  style?: CellStyle // Визуальные стили
}
