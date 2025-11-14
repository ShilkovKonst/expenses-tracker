import { GlobalDataType } from "@/types/formTypes";

export function validate(data: unknown): ValidationResultType {
  if (typeof data !== "object" || data === null)
    return validationResult(
      false,
      "data",
      "Data type isn't object or data is null"
    );

  const d = data as Partial<GlobalDataType>;

  if (typeof d.id !== "string")
    return validationResult(false, "data.id", "Data.id type isn't string");
  if (!objectIsNotArray(d.meta))
    return validationResult(
      false,
      "data.meta",
      "Data.meta type isn't a valid object"
    );
  if (!objectIsNotArray(d.tagsPool))
    return validationResult(
      false,
      "data.tagsPool",
      "Data.tagsPool type isn't a valid object"
    );
  if (!d.years || !Array.isArray(d.years))
    return validationResult(
      false,
      "data.years",
      "Data.years type isn't an array"
    );
  if (typeof d.totalAmount !== "number")
    return validationResult(
      false,
      "data.totalAmount",
      "Data.totalAmount type isn't a number"
    );

  const meta = d.meta;
  const allowedMetaKeys = ["createdAt", "updatedAt", "schemaVersion"];
  for (const key of allowedMetaKeys) {
    if (!(key in meta))
      return validationResult(
        false,
        key,
        `Required ${key} key doesn't exist in meta`
      );
  }

  if (Object.keys(meta).some((key) => !allowedMetaKeys.includes(key)))
    return validationResult(
      false,
      "meta",
      `Some meta keys are not allowed`
    );
  if (typeof meta.schemaVersion !== "number")
    return validationResult(
      false,
      "meta.schemaVersion",
      `Meta.schemaVersion type isn't a number`
    );
  if (typeof meta.createdAt !== "string")
    return validationResult(
      false,
      "meta.createdAt",
      `Meta.createdAt type isn't a string`
    );
  if (typeof meta.updatedAt !== "string")
    return validationResult(
      false,
      "meta.updatedAt",
      `Meta.updatedAt type isn't a string`
    );

  const tRegex = /^t\d+$/;

  const tagsPool = d.tagsPool;
  const tagKeys = Object.keys(tagsPool);
  for (const key of tagKeys) {
    if (!tRegex.test(key))
      return validationResult(
        false,
        key,
        `Key ${key} doesn't fit regex ${tRegex}`
      );
    if (typeof tagsPool[key] !== "string")
      return validationResult(
        false,
        key,
        `Key ${key} isn't a string`
      );
  }

  for (const year of d.years) {
    if (typeof year.id !== "number")
      return validationResult(
        false,
        "year.id",
        `Year.id ${year.id} isn't a number`
      );
    if (typeof year.totalAmount !== "number")
      return validationResult(
        false,
        "year.totalAmount",
        `Year.totalAmount ${year.totalAmount} isn't a number`
      );
    if (!Array.isArray(year.months))
      return validationResult(
        false,
        "year.months",
        `Year.months ${year.months} isn't an array`
      );

    for (const month of year.months) {
      if (typeof month.id !== "number")
        return validationResult(
          false,
          "month.id",
          `Month.id ${month.id} isn't a number`
        );
      if (typeof month.title !== "string")
        return validationResult(
          false,
          "month.title",
          `Month.title ${month.title} isn't a string`
        );
      if (!Array.isArray(month.records))
        return validationResult(
          false,
          "month.records",
          `Month.records ${month.records} isn't an array`
        );
      if (typeof month.totalAmount !== "number")
        return validationResult(
          false,
          "month.totalAmount",
          `Month.totalAmount ${month.totalAmount} isn't a number`
        );

      for (const record of month.records) {
        if (typeof record.id !== "string")
          return validationResult(
            false,
            "record.id",
            `Record.id ${record.id} isn't a string`
          );
        if (!["income", "cost"].includes(record.type))
          return validationResult(
            false,
            "record.type",
            `Record.type ${record.type} doesn't fit to a valid type`
          );
        if (typeof record.date !== "number")
          return validationResult(
            false,
            "record.date",
            `Record.date ${record.date} isn't a number`
          );
        if (typeof record.amount !== "number")
          return validationResult(
            false,
            "record.amount",
            `Record.amount ${record.amount} isn't a number`
          );
        if (typeof record.description !== "string")
          return validationResult(
            false,
            "record.description",
            `Record.description ${record.description} isn't a string`
          );
        if (!Array.isArray(record.tags))
          return validationResult(
            false,
            "record.tags",
            `Record.tags ${record.tags} isn't an array`
          );

        for (const tag of record.tags) {
          if (typeof tag !== "string")
            return validationResult(false, "tag", `Tag ${tag} isn't a string`);
          if (!tRegex.test(tag))
            return validationResult(
              false,
              "tag",
              `Tag ${tag} doesn't fit regex ${tRegex}`
            );
          if (!(tag in tagsPool))
            return validationResult(
              false,
              "tag",
              `Tag ${tag} doesn't exist in tags pool`
            );
        }
      }
    }
  }
  return validationResult(true, "data", `All the data is valid`);
}
type ValidationResultType = {
  validation: boolean;
  type: string;
  message: string;
};
const validationResult = (
  validation: boolean,
  type: string,
  message: string
): ValidationResultType => ({
  validation: false,
  type: type,
  message: message,
});

const objectIsNotArray = (o: unknown): o is Record<string, unknown> =>
  typeof o === "object" && o !== null && !Array.isArray(o);
