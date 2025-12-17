"use client";
import { useCallback, useMemo } from "react";
import { createRecordId, Month, MonthRecord } from "@/lib/types/dataTypes";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import HeaderBlock from "./HeaderBlock";
import RecordBlock from "./recordComponents/RecordBlock";
import { useModal } from "@/context/ModalContext";
import { compare } from "@/lib/utils/compareHelper";
import { createRecord } from "@/idb/CRUD/recordsCRUD";
import { useTracker } from "@/context/TrackerContext";
import { YearId } from "@/lib/types/brand";

type MonthProps = {
  yearId: YearId;
  month: Month;
};

const MonthBlock: React.FC<MonthProps> = ({ yearId, month }) => {
  const { locale } = useGlobal();
  const { trackerId } = useTracker();
  const { openModal } = useModal();

  const handleAddOperation = useCallback(() => {
    const newRecord: MonthRecord = {
      id: createRecordId(-1),
      year: yearId,
      month: month.id,
      day: -1,
      type: "cost",
      tags: [],
      description: "",
      amount: 0,
    };
    const onCreate = async (record: MonthRecord) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...partRecord } = record;
      await createRecord(trackerId, partRecord);
    };
    openModal("record", { record: newRecord, onConfirm: onCreate });
  }, [month.id, openModal, trackerId, yearId]);

  const isExpandDisabled = useMemo(
    () => month.records?.length === 0,
    [month.records]
  );

  return (
    <div
      key={month.id}
      id={`${yearId}-${month.id}-body`}
      data-month-body={yearId}
      data-month-id={month.id}
      data-year-id={yearId}
      className="month grid grid-cols-6 gap-2 w-full"
    >
      <HeaderBlock
        dataId={`${yearId}-${month.id}-header`}
        dataHeader={yearId.toString()}
        labelMain={`${t(locale, `body.form.valueMonth.${month.title}`)}`}
        totalAmount={month.totalAmount}
        totalRecords={month.records.length}
        expandDataType={`${yearId}-${month.id}`}
        isMonth={true}
        expandDisabled={isExpandDisabled}
        handleAddOperation={handleAddOperation}
      />
      <div
        id={`${yearId}-${month.id}`}
        style={{ height: 0 }}
        className="col-span-6 grid gap-2 pl-2 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {month.records
          .sort((a, b) =>
            a.day !== b.day ? a.day - b.day : compare(a.id, b.id)
          )
          .map((record, index) => (
            <RecordBlock key={index} record={record} />
          ))}
        <div></div>
      </div>
    </div>
  );
};

export default MonthBlock;
