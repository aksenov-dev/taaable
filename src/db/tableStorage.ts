import { openDB } from 'idb'

import type { IDBPDatabase, DBSchema } from 'idb'
import type { Table, TableDto } from '@/shared/types'

import { fromTableDto, toTableDto } from '@/shared/utils'

interface TableDB extends DBSchema {
  tables: {
    key: TableDto['tableId']
    value: TableDto
  }
}

let dbPromise: Promise<IDBPDatabase<TableDB>>

async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB('taaableDb', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tables')) {
          db.createObjectStore('tables', { keyPath: 'tableId' })
        }
      }
    })
  }

  return dbPromise
}

export function createTableStorage() {
  const getAllTables = async (): Promise<Table[]> => {
    const db = await initDB()
    const dtoList = await db.getAll('tables')

    return dtoList.map(fromTableDto)
  }

  const getTableById = async (tableId: string): Promise<Table | undefined> => {
    const db = await initDB()
    const dto = await db.get('tables', tableId)

    return dto ? fromTableDto(dto) : undefined
  }

  const saveTable = async (table: Table): Promise<void> => {
    const db = await initDB()
    await db.put('tables', toTableDto(table))
  }

  const deleteTableById = async (tableId: string): Promise<void> => {
    const db = await initDB()
    await db.delete('tables', tableId)
  }

  return {
    getAllTables,
    getTableById,
    saveTable,
    deleteTableById
  }
}
