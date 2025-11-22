import { TAGS_STORE } from "@/constants";
import { performDBOperation } from "./IDBManager";
import { TrackerTags } from "@/context/TrackerContext";

export type TagDBEntry = {
  id: number;
  title: string;
};

export async function createTag(
  trackerId: string,
  title: string
): Promise<number> {
  const tagEntry: Omit<TagDBEntry, "id"> = { title };
  return performDBOperation<number>(
    trackerId,
    TAGS_STORE,
    "readwrite",
    (store) => store.add(tagEntry)
  );
}

export async function getAllTags(trackerId: string): Promise<TrackerTags> {
  const tagsArray = await performDBOperation<TagDBEntry[]>(
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
): Promise<TagDBEntry | undefined> {
  return performDBOperation<TagDBEntry | undefined>(
    trackerId,
    TAGS_STORE,
    "readonly",
    (store) => store.get(tagId)
  );
}

export async function updateTag(
  trackerId: string,
  id: number,
  title: string
): Promise<number> {
  const tagEntry: TagDBEntry = { id, title };
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
