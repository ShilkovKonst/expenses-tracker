import { METADATA_STORE } from "@/constants";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { performDBOperation } from "../IDBManager";
import { TrackerId } from "@/lib/types/brand";

export async function createMetadata(
  trackerId: string,
  metadata: TrackerMeta,
): Promise<void> {
  return performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.add(metadata, "meta"),
  );
}

export async function updateMetadata(
  trackerId: TrackerId,
  newMeta: TrackerMeta,
): Promise<string> {
  await performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.put(newMeta, "meta"),
  );
  return newMeta.updatedAt;
}

export async function getMetadata(
  trackerId: string,
): Promise<TrackerMeta | undefined> {
  return performDBOperation<TrackerMeta | undefined>(
    trackerId,
    METADATA_STORE,
    "readonly",
    (store) => store.get("meta"),
  );
}
