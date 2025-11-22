import { createUpdateMetadata } from "@/idb/metaCRUD";
import { GlobalDataType, MonthRecord } from "../types/dataTypes";
import { batchAddRecords, batchAddTags } from "@/idb/IDBManager";

export async function populateIDBFromFile(data: GlobalDataType) {
  await createUpdateMetadata(data.id, data.meta);

  const tags = Object.values(data.tagsPool);
  await batchAddTags(data.id, tags);

  const allRecords: Omit<MonthRecord, "id">[] = [];
  for (const y of Object.values(data.years)) {
    for (const m of Object.values(y.months)) {
      for (const r of m.records) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = r;
        allRecords.push(rest);
      }
    }
  }
  await batchAddRecords(data.id, allRecords);
}
