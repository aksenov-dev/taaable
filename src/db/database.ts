import { openDB } from 'idb'

import type { IDBPDatabase, DBSchema } from 'idb'
import type { SheetDto, TableDto } from '@/shared/types'

interface TableDB extends DBSchema {
  tables: {
    key: TableDto['tableId']
    value: TableDto
  }
}

interface SheetDB extends DBSchema {
  sheets: {
    key: SheetDto['sheetId']
    value: SheetDto
    indexes: {
      byTableId: SheetDto['tableId']
    }
  }
}

let dbPromise: Promise<IDBPDatabase<TableDB & SheetDB>>

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('taaableDb', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tables')) {
          db.createObjectStore('tables', { keyPath: 'tableId' })
        }

        if (!db.objectStoreNames.contains('sheets')) {
          const store = db.createObjectStore('sheets', { keyPath: 'sheetId' })
          store.createIndex('byTableId', 'tableId')
        }
      }
    })
  }

  return dbPromise
}
