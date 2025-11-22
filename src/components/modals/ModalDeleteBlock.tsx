"use client";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { t } from "@/locales/locale";
import { MonthRecord } from "@/lib/types/dataTypes";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import { MONTHS } from "@/constants";
import { useTracker } from "@/context/TrackerContext";
import { useModalBody } from "@/hooks/useModalBody";
import { deleteRecord } from "@/idb/recordsCRUD";
import { updateMeta } from "@/lib/utils/updateDeleteHelper";

type ModalDeleteProps = {
  deleteEntity: "record" | "tag" | "tracker";
  handleDelete: (record: MonthRecord, isDelete: boolean) => void;
};

const ModalDeleteBlock = ({ deleteEntity, handleDelete }: ModalDeleteProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags, trackerMeta, setTrackerMeta } = useTracker();
  const { handleClear } = useModal();

  const { recordBody } = useModalBody();

  const handleDeleteClick = async () => {
    if (recordBody) {
      try {
        await deleteRecord(trackerId, recordBody.record.id);
        if (trackerMeta)
          await updateMeta(trackerId, trackerMeta, setTrackerMeta);
        handleDelete(recordBody.record, true);
      } catch {
        throw new Error("'Delete record' transaction failed!");
      }
    }
  };

  return (
    <form className="form grid grid-cols-2 gap-2">
      <p className="col-span-2 text-lg text-center font-bold mx-auto">
        {t(locale, "body.modal.titleDelete", {
          deleteEntity: t(locale, `body.modal.deleteEntity.${deleteEntity}`),
        })}
      </p>
      <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
        {recordBody && (
          <>
            <div className="w-full grid grid-cols-2 gap-2">
              <DescPBlock
                outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
                spanStyle={`text-xs truncate`}
                label={`${t(locale, `body.form.labels.year`)}: `}
                value={`${recordBody.record.year}, ${t(
                  locale,
                  `body.form.valueMonth.${MONTHS[recordBody.record.month]}`
                )}`}
              />
              <DescPBlock
                outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
                spanStyle={`text-xs truncate`}
                label={`${t(locale, `body.form.labels.date`)}: `}
                value={
                  recordBody.record.day > -1
                    ? recordBody.record.day
                    : t(locale, `body.form.labels.withoutDate`)
                }
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <DescPBlock
                outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
                spanStyle={`text-xs truncate ${
                  recordBody.record.type === "income"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
                label={`${t(locale, `body.form.operations.amount`)}: `}
                value={recordBody.record.amount}
              />
              {trackerTags && (
                <DescPBlock
                  outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
                  spanStyle={`text-xs truncate`}
                  label={`${t(locale, `body.form.operations.labelTags`)}: `}
                  value={recordBody.record.tags.map((t) => trackerTags[t])}
                />
              )}
            </div>
            <DescPBlock
              outerStyle="col-span-2 flex flex-row gap-2 justify-start items-start"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.operations.description`)}: `}
              value={recordBody.record.description}
            />
          </>
        )}
      </div>
      <MidLevelButton
        title={t(locale, "body.modal.labelDelete")}
        style="bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleDeleteClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

export default ModalDeleteBlock;
