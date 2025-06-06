import type { IDBPTransaction } from 'idb'
import type { AppDBSchema } from './database'
import type { SheetDataDto } from '@/shared/types'

import { getDB } from '@/db/database'

type DeleteSheetDataTransaction = IDBPTransaction<AppDBSchema, ['sheets', 'columns', 'rows', 'cells'], 'readwrite'>

export const createSheetDataStorage = () => {
  const getSheetsDataByTableId = async (tableId: string): Promise<SheetDataDto[]> => {
    const db = await getDB()

    const tx = db.transaction(['sheets', 'columns', 'rows', 'cells'], 'readonly')
    const sheetsStore = tx.objectStore('sheets')
    const columnsStore = tx.objectStore('columns')
    const rowsStore = tx.objectStore('rows')
    const cellsStore = tx.objectStore('cells')

    const sheetsIndex = sheetsStore.index('byTableId')
    const sheetIds = await sheetsIndex.getAllKeys(tableId)

    const columnsIndex = columnsStore.index('bySheetId')
    const rowsIndex = rowsStore.index('bySheetId')
    const cellsIndex = cellsStore.index('bySheetId')

    const sheetsDataPromises = sheetIds.map(async (sheetId) => {
      const [columns, rows, cells] = await Promise.all([
        columnsIndex.getAll(sheetId),
        rowsIndex.getAll(sheetId),
        cellsIndex.getAll(sheetId)
      ])

      return { sheetId, columns, rows, cells }
    })

    const sheetsData = await Promise.all(sheetsDataPromises)

    await tx.done

    return sheetsData
  }

  const saveSheetData = async (sheetData: SheetDataDto): Promise<void> => {
    const db = await getDB()

    const tx = db.transaction(['columns', 'rows'], 'readwrite')
    const columnsStore = tx.objectStore('columns')
    const rowsStore = tx.objectStore('rows')

    await Promise.all(sheetData.columns.map(column => columnsStore.put(column)))
    await Promise.all(sheetData.rows.map(row => rowsStore.put(row)))

    await tx.done
  }

  const deleteSheetData = async (tx: DeleteSheetDataTransaction, sheetId: string): Promise<void> => {
    const columnsStore = tx.objectStore('columns')
    const rowsStore = tx.objectStore('rows')
    const cellsStore = tx.objectStore('cells')

    const columnsIndex = columnsStore.index('bySheetId')
    const rowsIndex = rowsStore.index('bySheetId')
    const cellsIndex = cellsStore.index('bySheetId')

    const [columnIds, rowIds, cellIds] = await Promise.all([
      columnsIndex.getAllKeys(sheetId),
      rowsIndex.getAllKeys(sheetId),
      cellsIndex.getAllKeys(sheetId)
    ])

    await Promise.all(columnIds.map(id => columnsStore.delete(id)))
    await Promise.all(rowIds.map(id => rowsStore.delete(id)))
    await Promise.all(cellIds.map(id => cellsStore.delete(id)))
  }

  const deleteSheetDataBySheetId = async (sheetId: string): Promise<void> => {
    const db = await getDB()
    const tx = db.transaction(['columns', 'rows', 'cells'], 'readwrite')

    await deleteSheetData(tx, sheetId)

    await tx.done
  }

  const deleteSheetsDataByTableId = async (tableId: string): Promise<void> => {
    const db = await getDB()
    const tx = db.transaction(['sheets', 'columns', 'rows', 'cells'], 'readwrite')

    const sheetsStore = tx.objectStore('sheets')
    const sheetsIndex = sheetsStore.index('byTableId')
    const sheetIds = await sheetsIndex.getAllKeys(tableId)

    const deletePromises = sheetIds.map(sheetId => deleteSheetData(tx, sheetId))
    await Promise.all(deletePromises)

    await tx.done
  }

  return {
    getSheetsDataByTableId,
    saveSheetData,
    deleteSheetDataBySheetId,
    deleteSheetsDataByTableId
  }
}
