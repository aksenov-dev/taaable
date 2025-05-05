export type MainSortVariant = 'title' | 'date'
export type MainViewVariant = 'list' | 'grid'

export interface Settings {
  isDarkTheme: boolean
  sortVariant: MainSortVariant
  viewVariant: MainViewVariant
}

export interface TablePreview {
  tableId: string
  title: string
  viewedAt: number
}

export interface Table extends TablePreview {
  sheets: Sheet[]
}

interface Sheet {
  sheetId: string
}
