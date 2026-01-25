import { MonthRecord, Tracker } from "@/lib/types/dataTypes";
import { openDB } from "./IDBManager";
import { METADATA_STORE, RECORDS_STORE, TAGS_STORE } from "@/constants";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { TrackerId } from "@/lib/types/brand";

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

export async function getAllData(trackerId: string) {
  const db = await openDB(trackerId);
  const trackerData: Tracker = {
    meta: { id: "" as TrackerId, title: "", createdAt: "", updatedAt: "", backupAt: "" },
    tags: {},
    years: {},
    totalAmount: 0,
  };
  const ALL_STORES = [METADATA_STORE, TAGS_STORE, RECORDS_STORE];
  const tx = db.transaction(ALL_STORES, "readonly");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requests: Promise<any>[] = [];
  for (const KEY of ALL_STORES) {
    const store = tx.objectStore(KEY);
    const requestPromise = requestToPromise(store.getAll());
    requests.push(requestPromise);
  }
  const results = await Promise.all(requests);

  ALL_STORES.forEach((KEY, index) => {
    switch (KEY) {
      case METADATA_STORE:
        trackerData["meta"] = results[index][0];
        break;
      case TAGS_STORE:
        const result: Record<number, string> = {};
        const tagsArray = results[index];
        for (const tag of tagsArray) {
          result[tag.id] = tag.title;
        }
        trackerData["tags"] = result;
        break;
      case RECORDS_STORE:
        const years = populateYears(results[index]);
        trackerData["years"] = years;
        trackerData["totalAmount"] = Object.values(years).reduce(
          (acc, curr) => acc + curr.totalAmount,
          0
        );
        break;
    }
  });
  await awaitTransaction(tx);

  return trackerData;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function awaitTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
