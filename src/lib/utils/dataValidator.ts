import { ModalBodyType } from "@/context/ModalContext";
import { GlobalDataType } from "@/types/formTypes";

export type ValidationSuccess = {
  success: true;
  data: GlobalDataType;
};

export type ValidationError = {
  success: false;
  path: string;
  message: string;
};

export type ValidationResult = ValidationSuccess | ValidationError;

export function validate(data: unknown): ValidationResult {
  if (typeof data !== "object" || data === null)
    return fail("data", "Data is not an object or is null");

  const d = data as Partial<GlobalDataType>;

  if (typeof d.id !== "string") return fail("id", "id must be a string");
  if (!isObject(d.meta)) return fail("meta", "meta must be an object");
  if (!isObject(d.tagsPool))
    return fail("tagsPool", "tagsPool must be an object");
  if (!Array.isArray(d.years)) return fail("years", "years must be an array");
  if (typeof d.totalAmount !== "number")
    return fail("totalAmount", "totalAmount must be a number");

  const meta = d.meta as Record<string, unknown>;
  const allowedMetaKeys = ["createdAt", "updatedAt", "schemaVersion"];
  for (const key of allowedMetaKeys) {
    if (!(key in meta))
      return fail(`meta.${key}`, `Missing required meta key '${key}'`);
  }
  if (Object.keys(meta).some((key) => !allowedMetaKeys.includes(key)))
    return fail("meta", "Meta contains unknown keys");
  if (typeof meta.schemaVersion !== "number")
    return fail("meta.schemaVersion", "schemaVersion must be a number");
  if (typeof meta.createdAt !== "string")
    return fail("meta.createdAt", "createdAt must be a string");
  if (typeof meta.updatedAt !== "string")
    return fail("meta.updatedAt", "updatedAt must be a string");

  const tagsPool = d.tagsPool as Record<string, string>;
  const tRegex = /^t\d+$/;
  for (const [key, value] of Object.entries(tagsPool)) {
    if (!tRegex.test(key))
      return fail(`tagsPool.${key}`, `Invalid tag key '${key}'`);
    if (typeof value !== "string")
      return fail(`tagsPool.${key}`, `Tag value must be string`);
  }

  for (const year of d.years) {
    if (typeof year.id !== "number")
      return fail("year.id", `Invalid year id '${year.id}'`);
    if (typeof year.totalAmount !== "number")
      return fail(
        `year(${year.id}).totalAmount`,
        "totalAmount must be a number"
      );
    if (!Array.isArray(year.months))
      return fail(`year(${year.id}).months`, "months must be an array");

    for (const month of year.months) {
      if (typeof month.id !== "number")
        return fail(`month(${month.id}).id`, "id must be a number");
      if (typeof month.title !== "string")
        return fail(`month(${month.id}).title`, "title must be a string");
      if (!Array.isArray(month.records))
        return fail(`month(${month.id}).records`, "records must be an array");
      if (typeof month.totalAmount !== "number")
        return fail(
          `month(${month.id}).totalAmount`,
          "totalAmount must be a number"
        );

      for (const record of month.records) {
        const rPath = `record(${record.id})`;

        if (typeof record.id !== "string")
          return fail(`${rPath}.id`, "id must be a string");
        if (!["income", "cost"].includes(record.type))
          return fail(`${rPath}.type`, "type must be 'income' or 'cost'");
        if (typeof record.date !== "number")
          return fail(`${rPath}.date`, "date must be a number");
        if (typeof record.amount !== "number")
          return fail(`${rPath}.amount`, "amount must be a number");
        if (typeof record.description !== "string")
          return fail(`${rPath}.description`, "description must be a string");
        if (!Array.isArray(record.tags))
          return fail(`${rPath}.tags`, "tags must be an array");

        for (const tag of record.tags) {
          if (typeof tag !== "string")
            return fail(
              `${rPath}.tags`,
              `tag '${String(tag)}' is not a string`
            );
          if (!tRegex.test(tag))
            return fail(
              `${rPath}.tags`,
              `tag '${tag}' does not match pattern ${tRegex}`
            );
          if (!(tag in tagsPool))
            return fail(
              `${rPath}.tags`,
              `tag '${tag}' does not exist in tagsPool`
            );
        }
      }
    }
  }

  return { success: true, data: d as GlobalDataType };
}

const fail = (path: string, message: string): ValidationError => ({
  success: false,
  path,
  message,
});

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function tryValidate(json: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return fail("parse", "Invalid JSON format");
  }
  return validate(parsed);
}

export function isModalBodyType(
  body: ModalBodyType | GlobalDataType | null
): body is ModalBodyType {
  return body !== null && "record" in body;
}
