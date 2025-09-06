import type { RowDto } from '@/shared/types'

import { getDB } from './database'

export const createRowStorage = () => {
  const saveRow = async (row: RowDto): Promise<void> => {
    const db = await getDB()
    await db.put('rows', row)
  }

  return {
    saveRow
  }
}
