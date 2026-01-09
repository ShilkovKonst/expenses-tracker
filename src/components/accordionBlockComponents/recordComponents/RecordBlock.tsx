"use client";
import { MonthRecord } from "@/lib/types/dataTypes";
import RecordDescriptionBlock from "./RecordDescriptionBlock";
import ButtonBlock from "@/components/accordionBlockComponents/recordComponents/ButtonBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { useMemo } from "react";
import { deleteRecordById, updateRecordById } from "@/idb/CRUD/recordsCRUD";

type RecordProps = {
  record: MonthRecord;
};

function RecordBlock({ record }: RecordProps) {
  const { locale } = useGlobal();
  const { trackerId, trackerTags } = useTracker();
  const { openModal } = useModal();

  const recordTags = useMemo(() => {
    if (!record.tags?.length) return [];
    return trackerTags ? record.tags.map((t) => trackerTags[t]) : [];
  }, [record.tags, trackerTags]);

  const handleUpdate = () => {
    const onUpdate = async (record: MonthRecord) => {
      await updateRecordById(trackerId, record);
    };
    openModal("record", { record, onConfirm: onUpdate });
  };

  const handleDelete = () => {
    const onDelete = async () => {
      await deleteRecordById(trackerId, record.id);
    };
    openModal("delete", {
      entityType: "record",
      entity: record,
      onConfirm: onDelete,
    });
  };

  return (
    <div className="cost grid gap-2 w-full">
      <div className="px-2 py-2 grid grid-cols-6 gap-1 md:gap-2 w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-150">
        <RecordDescriptionBlock
          outerStyle="col-span-5 grid md:grid-cols-4 lg:grid-cols-5 gap-2 my-auto"
          labelRecordTags={`${t(locale, `body.form.operations.labelTags`)}: `}
          labelRecordDescription={`${t(
            locale,
            `body.form.operations.description`
          )}: `}
          labelRecordAmount={`${t(locale, `body.form.operations.amount`)}: `}
          labelRecordDate={`${t(locale, `body.form.labels.date`)}: `}
          recordType={record.type}
          recordTags={
            recordTags.length > 0
              ? recordTags
              : t(locale, "body.form.labels.withoutTags")
          }
          recordDescription={
            record.description.length > 0
              ? record.description
              : t(locale, "body.form.labels.withoutDesc")
          }
          recordAmount={record.amount}
          recordDate={
            record.day > -1
              ? record.day
              : t(locale, "body.form.labels.withoutDate")
          }
        />
        <ButtonBlock
          outerStyle={`col-span-1`}
          iconSize={"h-6 w-6 md:h-4 md:w-4"}
          buttonSize={"h-7.5 w-7.5 md:h-6 md:w-6"}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default RecordBlock;
