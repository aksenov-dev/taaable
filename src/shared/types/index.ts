export type MainSortVariant = 'title' | 'date'
export type MainViewVariant = 'list' | 'grid'

export interface Settings {
  isDarkTheme: boolean
  sortVariant: MainSortVariant
  viewVariant: MainViewVariant
}
