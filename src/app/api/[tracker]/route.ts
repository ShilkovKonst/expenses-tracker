import { transformToTracker } from "@/idb/apiHelpers/formDataParsers";
import { deleteDB } from "@/idb/IDBManager";
import { populateIDBFromFile } from "@/lib/utils/populateIDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await props.params;
  const formData = await req.formData();

  try {
    const data = await postTracker(tracker, formData);
    return NextResponse.json({
      ...data,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while creating new tracker ${tracker}`,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ tracker: string }> }
) {
  const { tracker } = await props.params;

  try {
    await deleteDB(tracker);
    return NextResponse.json({
      status: 200,
    });
  } catch {
    return NextResponse.json(
      {
        message: `Internal server error while deleting tracker ${tracker}`,
      },
      { status: 500 }
    );
  }
}

async function postTracker(tracker: string, form: FormData) {
  try {
    const tracker = transformToTracker(form);
    await populateIDBFromFile(tracker);
    return { tracker };
  } catch {
    throw new Error(
      `Internal server error while creating creating new tracker ${tracker}`
    );
  }
}
