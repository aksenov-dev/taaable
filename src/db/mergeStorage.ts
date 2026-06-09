import type { MergeDto } from '@/shared/types'

import { getDB } from './database'

export function createMergeStorage() {
  const saveMerge = async (merge: MergeDto): Promise<void> => {
    const db = await getDB()
    await db.put('merges', merge)
  }

  const deleteMerge = async (mergeId: MergeDto['mergeId']): Promise<void> => {
    const db = await getDB()
    await db.delete('merges', mergeId)
  }

  return {
    saveMerge,
    deleteMerge,
  }
}
