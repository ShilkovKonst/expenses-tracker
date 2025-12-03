import { createMetadata } from "@/idb/CRUD/metaCRUD";
import { Tracker } from "../types/dataTypes";
import { batchAddRecords, batchAddTags } from "@/idb/massImportHelper";

export async function populateIDBFromFile(
  data: Tracker,
  id: string = data.id
) {
  await createMetadata(id, data.meta);

  const tags = Object.values(data.tags);
  await batchAddTags(id, tags);

  const allRecords = Object.values(data.years).flatMap((year) =>
    Object.values(year.months).flatMap((month) =>
      month.records.map((r) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = r;
        return rest;
      })
    )
  );
  await batchAddRecords(id, allRecords);
}
