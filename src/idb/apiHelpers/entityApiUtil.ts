import { Tracker, MonthRecord } from "@/lib/types/dataTypes";
import { populateIDBFromFile } from "@/lib/utils/populateIDB";
import { deleteDB } from "../IDBManager";
import {
  createRecord,
  deleteRecordById,
  getAllRecords,
  getRecordById,
  getRecordsByYear,
  getRecordsByYearMonth,
  updateRecordById,
} from "../CRUD/recordsCRUD";
import {
  createTag,
  deleteTagById,
  getAllTags,
  getTagById,
  updateTagById,
} from "../CRUD/tagsCRUD";
import { TrackerId } from "@/lib/types/brand";
import { formatDatetoMeta } from "@/lib/utils/dateParser";

export async function createTrackerUtil(tracker: Tracker) {
  try {
    await populateIDBFromFile(tracker);
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong while creating new tracker '${tracker}'`
    );
  }
}

export async function deleteTrackerUtil(tracker: string) {
  try {
    await deleteDB(tracker);
  } catch (error) {
    console.error(error);
    throw new Error(`Something went wrong while deleting tracker '${tracker}'`);
  }
}

export async function getAllUtil(
  tracker: string,
  entity: "records" | "tags",
  year?: number,
  month?: number
) {
  try {
    switch (entity) {
      case "records":
        if (month && year)
          return await getRecordsByYearMonth(tracker, year, month);
        if (year) return await getRecordsByYear(tracker, year);
        return await getAllRecords(tracker);
      case "tags":
        return await getAllTags(tracker);
      default:
        return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Internal server error while fetching '${entity}' for '${tracker}'`
    );
  }
}

export async function getByIdUtil(
  tracker: string,
  entity: "records" | "tags",
  id: number
) {
  try {
    switch (entity) {
      case "records":
        return await getRecordById(tracker, id);
      case "tags":
        return await getTagById(tracker, id);
      default:
        return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Internal server error while fetching '${id}' of '${entity}' for '${tracker}'`
    );
  }
}

export async function createUtil(
  tracker: TrackerId,
  entity: "records" | "tags",
  data: Partial<MonthRecord> | string
) {
  try {
    let id: number;
    const updatedAt = formatDatetoMeta(new Date());
    switch (entity) {
      case "records":
        if (typeof data === "object") {
          id = await createRecord(tracker, data);
          return {
            id,
            updatedAt,
          };
        }
      case "tags":
        if (typeof data === "string") {
          id = await createTag(tracker, data);
          return {
            id,
            updatedAt,
          };
        }
      default:
        return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Internal server error while creating ${entity} for ${tracker}`
    );
  }
}

export async function updateByIdUtil(
  tracker: TrackerId,
  entity: string,
  data: MonthRecord | string,
  id?: number
) {
  try {
    const updatedAt = formatDatetoMeta(new Date());
    switch (entity) {
      case "records":
        if (typeof data === "object") {
          await updateRecordById(tracker, data);
          return {
            updatedAt,
          };
        }
      case "tags":
        if (typeof data === "string" && id) {
          await updateTagById(tracker, id, data);
          return {
            updatedAt,
          };
        }
      default:
        return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Something went wrong while updating '${id}' of '${entity}' for '${tracker}'`
    );
  }
}

export async function deleteByIdUtil(
  tracker: TrackerId,
  entity: string,
  id: number
) {
  try {
    const updatedAt = formatDatetoMeta(new Date());
    switch (entity) {
      case "records":
        await deleteRecordById(tracker, id);
        return { updatedAt };
      case "tags":
        await deleteTagById(tracker, id);
        return { updatedAt };
      default:
        return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      `Internal server error while deleting ${id} from ${entity} for ${tracker}`
    );
  }
}
