"use client";
import { Month, MonthRecord, Year } from "@/lib/types/dataTypes";
import ModalRecordForm from "./ModalRecordForm";
import SettingsBlock from "../settingsBlockComponents/SettingsBlock";
import ModalDeleteBlock from "./ModalDeleteBlock";
import { useTracker } from "@/context/TrackerContext";
import { useModal } from "@/context/ModalContext";
import { useModalBody } from "@/hooks/useModalBody";
import { updateObject, updateArray } from "@/lib/utils/updateDeleteHelper";
import ModalImportTrackerBlock from "./ModalImportTrackerBlock";
import { formatDatetoMeta } from "@/lib/utils/trackerDataSetter";

const ModalBlock = () => {
  const { trackerMeta, trackerYears, setTrackerMeta, setTrackerYears } =
    useTracker();
  const { modalType, handleClear } = useModal();

  const { recordBody, importTrackerBody } = useModalBody();

  const handleUpdateDelete = (record: MonthRecord, isDelete: boolean) => {
    if (!recordBody) return;
    if (!trackerMeta || !trackerYears) return;

    if (!record) return;

    const year = trackerYears[record.year];
    if (!year) return;

    const month = year.months[record.month];
    if (!month) return;

    const updRecord: MonthRecord = {
      ...record,
      amount: record.amount,
    };

    const { updated: updRecords, agg: totalAmount } = updateArray(
      month.records,
      updRecord,
      (items) =>
        items.reduce(
          (sum, c) => (c.type === "income" ? sum + c.amount : sum - c.amount),
          0
        ),
      isDelete
    );
    const updMonth: Month = {
      ...month,
      records: updRecords,
      totalAmount: totalAmount,
    };

    const { updated: updMonths, agg: monthTotalAmount } = updateObject(
      year.months,
      updMonth,
      (items) => items.reduce((sum, m) => sum + m.totalAmount, 0)
    );
    const updYear: Year = {
      ...year,
      months: updMonths,
      totalAmount: monthTotalAmount,
    };

    const { updated: updYears } = updateObject(trackerYears, updYear);
    setTrackerYears(updYears);
    setTrackerMeta({
      ...trackerMeta,
      updatedAt: formatDatetoMeta(new Date()),
    });
    handleClear();
  };

  return (
    <div
      id="foreground"
      className="fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center"
    >
      <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-1/2 bg-blue-50 p-5 rounded-lg">
        {modalType === "recordFormBlock" &&
          recordBody &&
          (recordBody.type === "del" ? (
            <ModalDeleteBlock
              deleteEntity="record"
              handleDelete={handleUpdateDelete}
            />
          ) : (
            <ModalRecordForm handleUpdate={handleUpdateDelete} />
          ))}
        {modalType === "mergeTrackerBlock" && importTrackerBody && (
          <ModalImportTrackerBlock />
        )}
        {modalType === "settingsBlock" && <SettingsBlock />}
      </div>
    </div>
  );
};

export default ModalBlock;
