import { openDB } from 'idb'

import type { IDBPDatabase, DBSchema } from 'idb'
import type { CellDto, ColumnDto, RowDto, SheetDto, TableDto } from '@/shared/types'

interface MetaDB extends DBSchema {
  meta: {
    key: string
    value: number | string
  }
}

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

interface ColumnDB extends DBSchema {
  columns: {
    key: ColumnDto['columnId']
    value: ColumnDto
    indexes: {
      'bySheetId': SheetDto['sheetId']
    }
  }
}

interface RowDB extends DBSchema {
  rows: {
    key: RowDto['rowId']
    value: RowDto
    indexes: {
      'bySheetId': SheetDto['sheetId']
    }
  }
}

interface CellDB extends DBSchema {
  cells: {
    key: [SheetDto['sheetId'], ColumnDto['columnId'], RowDto['rowId']]
    value: CellDto
    indexes: {
      'bySheetId': string
      'byColumnId': string
      'byRowId': string
    }
  }
}

let dbPromise: Promise<IDBPDatabase<MetaDB & TableDB & SheetDB & ColumnDB & RowDB & CellDB>>

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('TaaableDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }

        if (!db.objectStoreNames.contains('tables')) {
          db.createObjectStore('tables', { keyPath: 'tableId' })
        }

        if (!db.objectStoreNames.contains('sheets')) {
          const store = db.createObjectStore('sheets', { keyPath: 'sheetId' })
          store.createIndex('byTableId', 'tableId')
        }

        if (!db.objectStoreNames.contains('columns')) {
          const store = db.createObjectStore('columns', { keyPath: 'columnId' })
          store.createIndex('bySheetId', 'sheetId')
        }

        if (!db.objectStoreNames.contains('rows')) {
          const store = db.createObjectStore('rows', { keyPath: 'rowId' })
          store.createIndex('bySheetId', 'sheetId')
        }

        if (!db.objectStoreNames.contains('cells')) {
          const store = db.createObjectStore('cells', { keyPath: ['sheetId', 'columnId', 'rowId'] })
          store.createIndex('bySheetId', 'sheetId')
          store.createIndex('byColumnId', 'columnId')
          store.createIndex('byRowId', 'rowId')
        }
      }
    })
  }

  return dbPromise
}
