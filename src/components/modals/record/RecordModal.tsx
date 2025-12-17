"use client";
import { useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import { useTracker } from "@/context/TrackerContext";
import { useFlash } from "@/context/FlashContext";
import { useMemo, useState } from "react";
import { MonthRecord, TrackerMeta, Year } from "@/lib/types/dataTypes";
import {
  decimalToInputString,
  inputStringToDecimal,
} from "@/lib/utils/amountHelper";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { t } from "@/locales/locale";
import ModalBase from "../ModalBase";
import { ValidateButton } from "@/components/buttonComponents";
import RecordCreateUpdateBlock from "./RecordCreateUpdateBlock";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";

const RecordModal = ({
  record,
  onClose,
  onConfirm,
}: ModalMap["record"] & { onClose: () => void }) => {
  const { locale } = useGlobal();
  const { trackerId, trackerMeta, setTrackerMeta, setTrackerYears } =
    useTracker();
  const { addFlash } = useFlash();

  const [currentRecord, setCurrentRecord] = useState<MonthRecord>(record);
  const [amountString, setAmountString] = useState<string>(
    decimalToInputString(record.amount ?? 0)
  );

  const isCreate = useMemo(() => record.id === -1, [record.id]);

  const handleConfirm = async () => {
    const updRecord = {
      ...currentRecord,
      amount: inputStringToDecimal(amountString),
    };
    try {
      await onConfirm(updRecord);
      if (trackerMeta) {
        const updatedAt = formatDatetoMeta(new Date());
        const newMeta: TrackerMeta = {
          id: trackerMeta.id ?? trackerId,
          title: trackerMeta.title ?? trackerId,
          createdAt: trackerMeta.createdAt ?? updatedAt,
          updatedAt,
        };
        await updateMetadata(trackerId, newMeta);
        setTrackerMeta(newMeta);
      }
      const records = await getAllRecords(trackerId);
      const years: Record<number, Year> = populateYears(records);
      setTrackerYears(years);

      onClose();
      addFlash(
        "success",
        isCreate
          ? t(locale, `body.flash.newAdded`, {
              entity: t(locale, `body.modal.deleteEntity.record`),
            })
          : t(locale, "body.flash.updated", {
              entity: t(locale, `body.modal.deleteEntity.record`),
            })
      );
    } catch (error) {
      console.error(error);
      addFlash("error", getErrorMessage(error, ""));
    }
  };

  return (
    <ModalBase
      title={
        isCreate
          ? t(locale, "body.modal.titleCreate")
          : t(locale, "body.modal.titleUpdate")
      }
      sectionGridCols={2}
      closeButtonTitle={t(locale, "body.buttons.close")}
      cancelButtonTitle={t(locale, "body.buttons.cancel")}
      onClose={onClose}
    >
      <RecordCreateUpdateBlock
        currentRecord={currentRecord}
        setCurrentRecord={setCurrentRecord}
        amountString={amountString}
        setAmountString={setAmountString}
      />
      <ValidateButton
        title={t(locale, "body.buttons.confirm")}
        customStyle="col-span-2 bg-green-300 hover:bg-green-400 border-green-400"
        handleClick={handleConfirm}
      />
    </ModalBase>
  );
};

export default RecordModal;
