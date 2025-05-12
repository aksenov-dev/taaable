export type MainSortVariant = 'title' | 'date'
export type MainViewVariant = 'list' | 'grid'

export interface Settings {
  isDarkTheme: boolean
  sortVariant: MainSortVariant
  viewVariant: MainViewVariant
}

export interface Table {
  tableId: string
  title: string
  viewedAt: number
  sheets: Sheet[]
}

interface Sheet {
  sheetId: string
}

export type TablePreview = Pick<Table, 'tableId' | 'title' | 'viewedAt'>
