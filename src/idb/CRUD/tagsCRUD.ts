import { TAGS_STORE } from "@/constants";
import { TrackerTags } from "@/lib/types/dataTypes";
import { TagIDBType } from "../types";
import { performDBOperation } from "../IDBManager";

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
