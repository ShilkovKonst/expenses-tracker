import {
  transformToMonthRecord,
  transformToTagTitle,
} from "@/idb/apiHelpers/formDataParsers";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import {
  createRecord,
  getAllRecords,
  getRecordsByYear,
  getRecordsByYearMonth,
} from "@/idb/CRUD/recordsCRUD";
import { createTag, getAllTags } from "@/idb/CRUD/tagsCRUD";
import { TrackerId } from "@/lib/types/brand";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ tracker: string; entity: string }> }
) {
  const { tracker, entity } = await props.params;
  const searchParams = req?.nextUrl?.searchParams;
  const { month, year } = Object.fromEntries(searchParams.entries());
  try {
    const data = await getAll(tracker, entity, month, year);
    return NextResponse.json({
      ...data,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while fetching ${entity} for ${tracker}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ tracker: string; entity: string }> }
) {
  const { tracker, entity } = await props.params;
  const formData = await req.formData();

  try {
    const data = await post(tracker as TrackerId, entity, formData);
    return NextResponse.json({
      ...data,
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while creating ${entity} for ${tracker}`,
      },
      { status: 500 }
    );
  }
}

async function getAll(
  tracker: string,
  entity: string,
  month?: string,
  year?: string
) {
  try {
    switch (entity) {
      case "records":
        if (month && year)
          return await getRecordsByYearMonth(
            tracker,
            Number(year),
            Number(month)
          );
        if (year) return await getRecordsByYear(tracker, Number(year));
        return await getAllRecords(tracker);
      case "tags":
        return await getAllTags(tracker);
      default:
        return;
    }
  } catch {
    throw new Error(
      `Internal server error while fetching ${entity} for ${tracker}`
    );
  }
}

async function post(tracker: TrackerId, entity: string, form: FormData) {
  try {
    let id: number;
    let updatedAt: string;
    switch (entity) {
      case "records":
        const record = transformToMonthRecord(form);
        id = await createRecord(tracker, record);
        updatedAt = await updateMetadata(tracker);
        return {
          id,
          updatedAt,
        };
      case "tags":
        const title = transformToTagTitle(form);
        id = await createTag(tracker, title);
        updatedAt = await updateMetadata(tracker);
        return {
          id,
          updatedAt,
        };
      default:
        return;
    }
  } catch {
    throw new Error(
      `Internal server error while creating ${entity} for ${tracker}`
    );
  }
}
