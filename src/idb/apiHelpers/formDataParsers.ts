import {
  Tracker,
  MonthRecord,
  TrackerMeta,
  TrackerTags,
  TrackerYears,
  createRecordId,
  createTagId,
  createTrackerId,
  createYearId,
  createMonthId,
} from "@/lib/types/dataTypes";
export function transformToMonthRecord(form: FormData): MonthRecord {
  return {
    id: createRecordId(Number(form.get("id")) ?? -1),
    year: createYearId(Number(form.get("year")) ?? -1),
    month: createMonthId(Number(form.get("month")) ?? -1),
    day: Number(form.get("day")) ?? -1,
    type: (String(form.get("type")) as "cost" | "income") ?? "cost",
    description: String(form.get("description")) ?? "",
    amount: Number(form.get("amount")) ?? 0,
    tags: form.getAll("tags").map((t) => createTagId(Number(t))),
  };
}

export function transformToTagTitle(form: FormData): string {
  return String(form.get("title")) ?? "";
}

export function transformToTracker(form: FormData): Tracker {
  const metaString = form.get("meta");
  const tagsString = form.get("tags");
  const yearsString = form.get("years");
  const id = createTrackerId(String(form.get("id")) ?? "");
  return {
    meta: metaString
      ? parseToMeta(metaString.toString())
      : {
          id,
          title: id,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        },
    tags: tagsString ? parseToTags(tagsString.toString()) : {},
    years: yearsString ? parseToYears(yearsString.toString()) : {},
    totalAmount: Number(form.get("id")) ?? 0,
  };
}

export function parseToMeta(s: string): TrackerMeta {
  return JSON.parse(s);
}

export function parseToTags(s: string): TrackerTags {
  return JSON.parse(s);
}

export function parseToYears(s: string): TrackerYears {
  return JSON.parse(s);
}
