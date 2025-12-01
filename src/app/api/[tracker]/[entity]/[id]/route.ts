import {
  transformToMonthRecord,
  transformToTagTitle,
} from "@/idb/apiHelpers/formDataParsers";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import {
  getAllRecords,
  getRecordById,
  updateRecordById,
} from "@/idb/CRUD/recordsCRUD";
import { getAllTags, getTagById, updateTagById } from "@/idb/CRUD/tagsCRUD";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ tracker: string; entity: string; id: string }> }
) {
  const { tracker, entity, id } = await props.params;
  try {
    const data = await getById(tracker, entity, id);
    return NextResponse.json({
      ...data,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while fetching ${id} from ${entity} for ${tracker}`,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ tracker: string; entity: string; id: string }> }
) {
  const { tracker, entity, id } = await props.params;
  const formData = await req.formData();

  try {
    const data = await putById(tracker, entity, id, formData);
    return NextResponse.json({
      ...data,
      status: 202,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while updating ${id} from ${entity} for ${tracker}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ tracker: string; entity: string; id: string }> }
) {
  const { tracker, entity, id } = await props.params;

  try {
    const data = await deleteById(tracker, entity, id);
    return NextResponse.json({
      ...data,
      status: 202,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while deleting ${id} from ${entity} for ${tracker}`,
      },
      { status: 500 }
    );
  }
}

async function getById(tracker: string, entity: string, id: string) {
  try {
    switch (entity) {
      case "records":
        return await getRecordById(tracker, Number(id));
      case "tags":
        return await getTagById(tracker, Number(id));
      default:
        return;
    }
  } catch {
    throw new Error(
      `Internal server error while fetching ${id} from ${entity} for ${tracker}`
    );
  }
}

async function putById(
  tracker: string,
  entity: string,
  id: string,
  form: FormData
) {
  try {
    let updatedAt: string;
    switch (entity) {
      case "records":
        const record = transformToMonthRecord(form);
        await updateRecordById(tracker, record);
        updatedAt = await updateMetadata(tracker);
        return {
          updatedAt,
        };
      case "tags":
        const title = transformToTagTitle(form);
        await updateTagById(tracker, Number(id), title);
        updatedAt = await updateMetadata(tracker);
        return {
          updatedAt,
        };
      default:
        return;
    }
  } catch {
    throw new Error(
      `Internal server error while updating ${id} from ${entity} for ${tracker}`
    );
  }
}

async function deleteById(tracker: string, entity: string, id: string) {
  try {
    switch (entity) {
      case "records":
        return await getAllRecords(tracker);
      case "tags":
        return await getAllTags(tracker);
      default:
        return;
    }
  } catch {
    throw new Error(
      `Internal server error while deleting ${id} from ${entity} for ${tracker}`
    );
  }
}
