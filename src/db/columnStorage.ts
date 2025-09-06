import type { ColumnDto } from '@/shared/types'

import { getDB } from './database'

export const createColumnStorage = () => {
  const saveColumn = async (column: ColumnDto): Promise<void> => {
    const db = await getDB()
    await db.put('columns', column)
  }

  return {
    saveColumn
  }
}
