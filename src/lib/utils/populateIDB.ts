import { createMetadata } from "@/idb/CRUD/metaCRUD";
import { Tracker } from "../types/dataTypes";
import { batchAddRecords, batchAddTags } from "@/idb/massImportHelper";
import { deleteDB } from "@/idb/IDBManager";

export async function populateIDBFromFile(data: Tracker) {
  try {
    await createMetadata(data.meta.id, data.meta);

    const tags = Object.values(data.tags);
    await batchAddTags(data.meta.id, tags);

    const allRecords = Object.values(data.years).flatMap((year) =>
      Object.values(year.months).flatMap((month) =>
        month.records.map((r) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = r;
          return rest;
        })
      )
    );
    await batchAddRecords(data.meta.id, allRecords);
  } catch (error) {
    try {
      await deleteDB(data.meta.id);
    } catch {
      // cleanup is best-effort
    }
    throw error;
  }
}
