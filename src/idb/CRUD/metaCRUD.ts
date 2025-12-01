import { METADATA_STORE } from "@/constants";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { performDBOperation } from "../IDBManager";
import { formatDatetoMeta } from "@/lib/utils/dateParser";

export async function createMetadata(
  trackerId: string,
  metadata: TrackerMeta
): Promise<void> {
  console.log("test createMetadata");
  return performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.add(metadata, "meta")
  );
}

export async function updateMetadata(trackerId: string): Promise<string> {
  const timestamp = formatDatetoMeta(new Date());
  const oldMeta: TrackerMeta | undefined = await getMetadata(trackerId);
  if (!oldMeta) throw new Error("old metadata is absent");
  const newMeta: TrackerMeta = {
    createdAt: oldMeta.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
  await performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.put(newMeta, "meta")
  );
  return timestamp;
}

export async function getMetadata(
  trackerId: string
): Promise<TrackerMeta | undefined> {
  return performDBOperation<TrackerMeta | undefined>(
    trackerId,
    METADATA_STORE,
    "readonly",
    (store) => store.get("meta")
  );
}
