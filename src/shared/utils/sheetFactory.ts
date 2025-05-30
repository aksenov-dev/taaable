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

export const toSheetDto = (sheet: Sheet): SheetDto => {
  const { sheetId, tableId, title, order } = sheet
  return { sheetId, tableId, title, order }
}

export const fromSheetDto = (dto: SheetDto): Sheet => {
  return {
    ...dto
  }
}
