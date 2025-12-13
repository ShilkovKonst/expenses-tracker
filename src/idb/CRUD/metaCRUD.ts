import { METADATA_STORE } from "@/constants";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { performDBOperation } from "../IDBManager";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { TrackerId } from "@/lib/types/brand";

export async function createMetadata(
  trackerId: string,
  metadata: TrackerMeta
): Promise<void> {
  return performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.add(metadata, "meta")
  );
}

export async function updateMetadata(trackerId: TrackerId): Promise<string> {
  const timestamp = formatDatetoMeta(new Date());
  const oldMeta: TrackerMeta | undefined = await getMetadata(trackerId);
  if (!oldMeta) throw new Error("old metadata is absent");
  const newMeta: TrackerMeta = {
    id: oldMeta.id ?? trackerId,
    title: oldMeta.title ?? (trackerId as string),
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
