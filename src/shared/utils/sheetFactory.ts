import { nanoid } from 'nanoid'

import type { Sheet, SheetDto } from '@/shared/types'

export function generateSheet(tableId: string, order: number, titleNumber: number): Sheet {
  return {
    sheetId: nanoid(),
    tableId,
    title: `Лист ${titleNumber}`,
    order,
  }
}

export function toSheetDto(sheet: Sheet): SheetDto {
  return {
    sheetId: sheet.sheetId,
    tableId: sheet.tableId,
    title: sheet.title,
    order: sheet.order,
  }
}

export function fromSheetDto(dto: SheetDto): Sheet {
  return {
    ...dto,
  }
}
