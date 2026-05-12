export type MainSortVariant = 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc'
export type MainViewVariant = 'list' | 'grid'

export interface Settings {
  isDarkTheme: boolean
  sortVariant: MainSortVariant
  viewVariant: MainViewVariant
}
