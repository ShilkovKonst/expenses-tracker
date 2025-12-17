"use client";
import {
  METADATA_STORE,
  MONTHS_STORE,
  RECORDS_STORE,
  TAGS_STORE,
  YEARS_STORE,
} from "@/constants";
import { getMetadata } from "./CRUD/metaCRUD";
import { TrackerId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";

const dbCache = new Map<string, IDBDatabase>();

export async function openDB(dbName: string): Promise<IDBDatabase> {
  const cached = dbCache.get(dbName);
  if (cached) {
    return cached;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        dbCache.delete(dbName);
        db.close();
      };

      dbCache.set(dbName, db);
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
        store.createIndex("by_tags", "tags", {
          unique: false,
          multiEntry: true,
        });
      } else {
        const tx = (event.target as IDBOpenDBRequest).transaction!;
        const store = tx.objectStore(RECORDS_STORE);

        if (!store.indexNames.contains("by_tags")) {
          store.createIndex("by_tags", "tags", {
            unique: false,
            multiEntry: true,
          });
        }
      }
    };
  });
}

export async function deleteDB(dbName: string) {
  return new Promise<void>((resolve, reject) => {
    const cached = dbCache.get(dbName);
    if (cached) {
      try {
        cached.close();
      } catch (error) {
        console.error(error);
      }
      dbCache.delete(dbName);
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

export async function getAllMeta() {
  const databases = await indexedDB.databases();
  const metadataPromises = databases
    .filter((db) => db.name)
    .map(async (db) => {
      try {
        const meta = await getMetadata(db.name as TrackerId);
        if (meta && (!("id" in meta) || !("title" in meta))) {
          return {
            ...(meta as TrackerMeta),
            id: db.name as TrackerId,
            title: db.name,
          };
        }
        return meta;
      } catch (error) {
        console.warn(`Failed to load metadata for ${db.name}:`, error);
        return undefined;
      }
    });
  const results = await Promise.all(metadataPromises);
  const validMetas = results.filter(
    (meta): meta is TrackerMeta => meta !== undefined
  );
  return validMetas;
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
