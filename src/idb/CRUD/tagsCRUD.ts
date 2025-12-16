import { METADATA_STORE, RECORDS_STORE, TAGS_STORE } from "@/constants";
import { MonthRecord, TrackerMeta, TrackerTags } from "@/lib/types/dataTypes";
import { TagIDBType } from "../types";
import { openDB, performDBOperation } from "../IDBManager";
import { formatDatetoMeta } from "@/lib/utils/dateParser";

export async function createTag(
  trackerId: string,
  title: string
): Promise<number> {
  const tagEntry: Omit<TagIDBType, "id"> = { title };
  return performDBOperation<number>(
    trackerId,
    TAGS_STORE,
    "readwrite",
    (store) => store.add(tagEntry)
  );
}

export async function getAllTags(trackerId: string): Promise<TrackerTags> {
  const tagsArray = await performDBOperation<TagIDBType[]>(
    trackerId,
    TAGS_STORE,
    "readonly",
    (store) => store.getAll()
  );

  const result: Record<number, string> = {};
  for (const tag of tagsArray) {
    result[tag.id] = tag.title;
  }
  return result;
}

export async function getTagById(
  trackerId: string,
  tagId: number
): Promise<TagIDBType | undefined> {
  return performDBOperation<TagIDBType | undefined>(
    trackerId,
    TAGS_STORE,
    "readonly",
    (store) => store.get(tagId)
  );
}

export async function updateTagById(
  trackerId: string,
  id: number,
  title: string
): Promise<number> {
  const tagEntry: TagIDBType = { id, title };
  return performDBOperation<number>(
    trackerId,
    TAGS_STORE,
    "readwrite",
    (store) => store.put(tagEntry)
  );
}

export async function deleteTagById(
  trackerId: string,
  tagId: number
): Promise<void> {
  return performDBOperation<void>(trackerId, TAGS_STORE, "readwrite", (store) =>
    store.delete(tagId)
  );
}

export async function deleteTagByIdRecordsCleanup(
  trackerId: string,
  tagId: number
): Promise<void> {
  const db = await openDB(trackerId);

  return new Promise((resolve, reject) => {
    // Создаем транзакцию для обоих store
    const tx = db.transaction(
      [TAGS_STORE, RECORDS_STORE, METADATA_STORE],
      "readwrite"
    );

    const tagStore = tx.objectStore(TAGS_STORE);
    tagStore.delete(tagId);

    const recordStore = tx.objectStore(RECORDS_STORE);
    const index = recordStore.index("by_tags");
    const request = index.getAll(tagId);
    request.onsuccess = () => {
      const affectedRecords: MonthRecord[] = request.result;
      for (const record of affectedRecords) {
        record.tags = record.tags.filter((id: number) => id !== tagId);
        recordStore.put(record);
      }
    };

    const metaStore = tx.objectStore(METADATA_STORE);
    const metaRequest = metaStore.get("meta");
    metaRequest.onsuccess = () => {
      const timestamp = formatDatetoMeta(new Date());
      const oldMeta: TrackerMeta = metaRequest.result;
      metaStore.put({ ...oldMeta, updatedAt: timestamp }, "meta");
    };

    request.onerror = () => reject(request.error);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
