"use client";
import { MonthRecord } from "@/lib/types/dataTypes";
import RecordDescriptionBlock from "./RecordDescriptionBlock";
import ButtonBlock from "@/components/accordionBlockComponents/recordComponents/ButtonBlock";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { deleteRecordById, updateRecordById } from "@/idb/CRUD/recordsCRUD";

type RecordProps = {
  record: MonthRecord;
};

function RecordBlock({ record }: RecordProps) {
  const { trackerId } = useTracker();
  const { openModal } = useModal();

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
          record={record}
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
