import { nanoid } from 'nanoid'

import type { Sheet, SheetDto } from '@/shared/types'

export function createSheetObject(tableId: string, order: number): Sheet {
  return {
    sheetId: nanoid(),
    tableId,
    title: `Лист ${order + 1}`,
    order,
    columns: [],
    rows: {},
    cells: {}
  }
}

export function toSheetDto(sheet: Sheet): SheetDto {
  const { sheetId, tableId, title, order } = sheet
  return { sheetId, tableId, title, order }
}

export function fromSheetDto(dto: SheetDto): Sheet {
  return {
    ...dto,
    columns: [],
    rows: {},
    cells: {}
  }
}
