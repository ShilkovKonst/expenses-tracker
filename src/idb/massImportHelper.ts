import { MonthRecord } from "@/lib/types/dataTypes";
import { openDB } from "./IDBManager";
import { RECORDS_STORE, TAGS_STORE } from "@/constants";

export async function batchAddTags(trackerId: string, tags: string[]) {
  const db = await openDB(trackerId);
  const tx = db.transaction(TAGS_STORE, "readwrite");
  const store = tx.objectStore(TAGS_STORE);

  for (const title of tags) {
    store.add({ title });
  }

  await awaitTransaction(tx);
}

export async function batchAddRecords(
  trackerId: string,
  records: Omit<MonthRecord, "id">[]
) {
  const db = await openDB(trackerId);
  const tx = db.transaction(RECORDS_STORE, "readwrite");
  const store = tx.objectStore(RECORDS_STORE);

  for (const r of records) {
    store.add(r);
  }

  await awaitTransaction(tx);
}

function awaitTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
