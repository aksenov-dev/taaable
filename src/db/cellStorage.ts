import type { CellDto } from '@/shared/types'

import { getDB } from './database'

export function createCellStorage() {
  const saveCell = async (cell: CellDto): Promise<void> => {
    const db = await getDB()
    await db.put('cells', cell)
  }

  return {
    saveCell,
  }
}
