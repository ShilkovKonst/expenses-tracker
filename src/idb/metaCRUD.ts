import { METADATA_STORE } from "@/constants";
import { performDBOperation } from "./IDBManager";
import { MetadataType } from "../lib/types/dataTypes";

export async function createUpdateMetadata(
  trackerId: string,
  metadata: MetadataType
): Promise<void> {
  return performDBOperation(trackerId, METADATA_STORE, "readwrite", (store) =>
    store.put(metadata, "meta")
  );
}

export async function getMetadata(
  trackerId: string
): Promise<MetadataType | undefined> {
  return performDBOperation<MetadataType | undefined>(
    trackerId,
    METADATA_STORE,
    "readonly",
    (store) => store.get("meta")
  );
}
