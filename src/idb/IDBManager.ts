"use client";
import {
  METADATA_STORE,
  MONTHS_STORE,
  RECORDS_STORE,
  TAGS_STORE,
  YEARS_STORE,
} from "@/constants";

export let dbInstance: IDBDatabase | null = null;

export async function openDB(dbName: string): Promise<IDBDatabase> {
  if (dbInstance && dbInstance.name === dbName) {
    return dbInstance;
  }

  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };

      dbInstance = db;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE);
      }

      if (!db.objectStoreNames.contains(TAGS_STORE)) {
        db.createObjectStore(TAGS_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains(YEARS_STORE)) {
        db.createObjectStore(YEARS_STORE, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains(MONTHS_STORE)) {
        const store = db.createObjectStore(MONTHS_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by_year", "year", { unique: false });
      }

      if (!db.objectStoreNames.contains(RECORDS_STORE)) {
        const store = db.createObjectStore(RECORDS_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("by_year", "year", { unique: false });
        store.createIndex("by_year_month", ["year", "month"], {
          unique: false,
        });
      }
    };
  });
}

export async function deleteDB(dbName: string) {
  return new Promise<void>((resolve, reject) => {
    if (dbInstance && dbInstance.name === dbName) {
      try {
        dbInstance.close();
      } catch {}
      dbInstance = null;
    }

    const request = indexedDB.deleteDatabase(dbName);
    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(
        new Error(
          `Failed to delete database ${dbName}: ${request.error?.message}`
        )
      );
    request.onblocked = () =>
      reject(
        new Error(
          `Cannot delete database ${dbName}: it's still open somewhere.`
        )
      );
  });
}

export async function performDBOperation<T>(
  trackerId: string,
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await openDB(trackerId);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function checkDBExists(dbName: string): Promise<boolean> {
  if (!("databases" in indexedDB)) {
    console.warn(
      "indexedDB.databases() не поддерживается. Использование fallback."
    );
    return checkDBExistsFallback(dbName);
  }

  try {
    const dbs = await indexedDB.databases();
    return dbs.some((db) => db.name === dbName);
  } catch (error) {
    console.error("Ошибка при получении списка баз данных:", error);
    return false;
  }
}

function checkDBExistsFallback(dbName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      (event.target as IDBRequest).transaction?.abort();
      resolve(false);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      db.close();
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
}
