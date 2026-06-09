import { nanoid } from 'nanoid'

import type { Merge, MergeDto, MergesData } from '../types'

export function generateMerge(sheetId: string, anchorCellId: string, colSpan: number, rowSpan: number): Merge {
  return {
    mergeId: nanoid(),
    sheetId,
    anchorCellId,
    colSpan,
    rowSpan,
  }
}

export function mergesRecordToArray(merges: MergesData['merges']): Merge[] {
  return Object.values(merges)
}

export function mergesArrayToMergesData(merges: Merge[]): MergesData {
  return {
    merges: Object.fromEntries(merges.map(m => [m.mergeId, m])),
  }
}

export function toMergeDto(merge: Merge): MergeDto {
  return { ...merge }
}

export function fromMergeDto(dto: MergeDto): Merge {
  return { ...dto }
}
