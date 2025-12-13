import { Tracker } from "@/lib/types/dataTypes";
import { Locale, t } from "@/locales/locale";

export type ValidationSuccess = {
  success: true;
  data: Tracker;
};

export type ValidationError = {
  success: false;
  path: string;
  message: string;
};

export type ValidationResult = ValidationSuccess | ValidationError;

export function validate(data: unknown, locale: Locale): ValidationResult {
  if (typeof data !== "object" || data === null)
    return fail("data", "Data is not an object or is null");

  const d = data as Partial<Tracker>;

  // if (typeof d.id !== "string")
  //   return fail("id", t(locale, "body.flash.error.validator.string"));
  if (!isObject(d.meta))
    return fail("meta", t(locale, "body.flash.error.validator.object"));
  if (!isObject(d.tags))
    return fail("tags", t(locale, "body.flash.error.validator.object"));
  if (!isObject(d.years))
    return fail("years", t(locale, "body.flash.error.validator.object"));
  if (typeof d.totalAmount !== "number")
    return fail("totalAmount", t(locale, "body.flash.error.validator.number"));

  const meta = d.meta as Record<string, unknown>;
  const allowedMetaKeys = ["id", "title", "createdAt", "updatedAt"];
  for (const key of allowedMetaKeys) {
    if (!(key in meta))
      return fail(
        `meta.${key}`,
        `${t(locale, "body.flash.error.validator.meta.keyAbsent")} '${key}'`
      );
  }
  if (Object.keys(meta).some((key) => !allowedMetaKeys.includes(key)))
    return fail(
      "meta",
      t(locale, "body.flash.error.validator.meta.keyUnknown")
    );
  if (typeof meta.createdAt !== "string")
    return fail(
      "meta.createdAt",
      t(locale, "body.flash.error.validator.string")
    );
  if (typeof meta.updatedAt !== "string")
    return fail(
      "meta.updatedAt",
      t(locale, "body.flash.error.validator.string")
    );

  const tags: Record<number, string> = d.tags;
  for (const [key, value] of Object.entries(tags)) {
    if (typeof value !== "string")
      return fail(
        `tagsPool.${key}`,
        t(locale, "body.flash.error.validator.string")
      );
  }

  for (const year of Object.values(d.years)) {
    if (typeof year.id !== "number")
      return fail(
        "year.id",
        `'${year.id}' ${t(locale, "body.flash.error.validator.number")}`
      );
    if (typeof year.totalAmount !== "number")
      return fail(
        `year(${year.id}).totalAmount`,
        t(locale, "body.flash.error.validator.number")
      );
    if (!isObject(year.months))
      return fail(
        `year(${year.id}).months`,
        t(locale, "body.flash.error.validator.object")
      );

    for (const month of Object.values(year.months)) {
      if (typeof month.id !== "number")
        return fail(
          `month(${month.id}).id`,
          t(locale, "body.flash.error.validator.number")
        );
      if (typeof month.title !== "string")
        return fail(
          `month(${month.id}).title`,
          t(locale, "body.flash.error.validator.string")
        );
      if (!Array.isArray(month.records))
        return fail(
          `month(${month.id}).records`,
          t(locale, "body.flash.error.validator.array")
        );
      if (typeof month.totalAmount !== "number")
        return fail(
          `month(${month.id}).totalAmount`,
          t(locale, "body.flash.error.validator.number")
        );

      for (const record of month.records) {
        const rPath = `record(${record.year}-${record.month}-${record.day})`;

        if (typeof record.id !== "number")
          return fail(
            `${rPath}.id`,
            t(locale, "body.flash.error.validator.number")
          );
        if (!["income", "cost"].includes(record.type))
          return fail(`${rPath}.type`, "type must be 'income' or 'cost'");
        if (typeof record.day !== "number")
          return fail(
            `${rPath}.day`,
            t(locale, "body.flash.error.validator.number")
          );
        if (typeof record.month !== "number")
          return fail(
            `${rPath}.month`,
            t(locale, "body.flash.error.validator.number")
          );
        if (typeof record.year !== "number")
          return fail(
            `${rPath}.year`,
            t(locale, "body.flash.error.validator.number")
          );
        if (typeof record.amount !== "number")
          return fail(
            `${rPath}.amount`,
            t(locale, "body.flash.error.validator.number")
          );
        if (typeof record.description !== "string")
          return fail(
            `${rPath}.description`,
            t(locale, "body.flash.error.validator.string")
          );
        if (!Array.isArray(record.tags))
          return fail(
            `${rPath}.tags`,
            t(locale, "body.flash.error.validator.array")
          );

        for (const tag of record.tags) {
          if (typeof tag !== "number")
            return fail(
              `${rPath}.tags`,
              `'${String(tag)}' ${t(
                locale,
                "body.flash.error.validator.number"
              )}`
            );
          if (!(tag in tags))
            return fail(
              `${rPath}.tags`,
              `'${tag}' ${t(locale, "body.flash.error.validator.tag")}`
            );
        }
      }
    }
  }

  return { success: true, data: d as Tracker };
}

const fail = (path: string, message: string): ValidationError => ({
  success: false,
  path,
  message,
});

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function tryValidate(json: string, locale: Locale): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return fail("parse", "Invalid JSON format");
  }
  return validate(parsed, locale);
}
