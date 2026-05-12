export interface Props {
  tableId: string
  title: string
  date: number
}

export interface Emits {
  rename: [value: string]
  delete: []
}
