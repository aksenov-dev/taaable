export interface Merge {
  mergeId: string
  sheetId: string
  anchorCellId: string
  colSpan: number
  rowSpan: number
}

export interface MergeBounds {
  minColumn: number
  maxColumn: number
  minRow: number
  maxRow: number
}

export interface MergesData {
  merges: Record<string, Merge>
}

export type MergeDto = Merge
