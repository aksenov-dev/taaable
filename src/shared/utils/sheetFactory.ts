import { nanoid } from 'nanoid'

import type { Sheet, SheetDto } from '@/shared/types'

export const generateSheet = (tableId: string, order: number, titleNumber: number): Sheet => {
  return {
    sheetId: nanoid(),
    tableId,
    title: `Лист ${titleNumber}`,
    order
  }
}

export const toSheetDto = (sheet: Sheet): SheetDto => ({
  sheetId: sheet.sheetId,
  tableId: sheet.tableId,
  title: sheet.title,
  order: sheet.order
})

export const fromSheetDto = (dto: SheetDto): Sheet => {
  return {
    ...dto
  }
}
