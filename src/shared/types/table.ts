export interface Table {
  tableId: string
  title: string
  viewedAt: number
}

export type TableDto = Pick<Table, 'tableId' | 'title' | 'viewedAt'>
