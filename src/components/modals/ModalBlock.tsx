"use client";
import { Month, MonthRecord, Year } from "@/types/formTypes";
import ModalRecordForm from "./ModalRecordForm";
import SettingsBlock from "../settingsBlockComponents/SettingsBlock";
import ModalDeleteBlock from "./ModalDeleteBlock";
import { useTracker } from "@/context/TrackerContext";
import { useModal } from "@/context/ModalContext";
import { useModalBody } from "@/hooks/useModalBody";
import { updateItem } from "@/lib/utils/updateDeleteHelper";
import { CURRENT_YEAR } from "@/lib/constants";
import ModalMergeTrackerBlock from "./ModalMergeTrackerBlock";

const ModalBlock = () => {
  const { trackerMeta, trackerYears, setTrackerMeta, setTrackerYears } =
    useTracker();
  const { modalType, handleClear } = useModal();

  const { recordBody, globalBody } = useModalBody();

  const handleUpdateDelete = (record: MonthRecord, isDelete: boolean) => {
    if (!recordBody) return;
    if (!trackerMeta || !trackerYears) return;

    const { yearId, monthId, type } = recordBody;
    if (!yearId || !monthId) return;

    const yearIdx = CURRENT_YEAR - yearId;
    if (yearIdx < 0) return;
    const year = trackerYears[yearIdx];
    if (!year) return;
    const month = year.months[monthId - 1];
    if (!month) return;

    const updRecord: MonthRecord = {
      ...record,
      amount: Math.round(record.amount * 100) / 100,
    };

    const oldRecord = month.records.find((r) => r.id === record.id);
    const oldId = record.id;
    if (
      type === "crt" ||
      (type === "upd" && oldRecord && oldRecord.date !== record.date)
    ) {
      const dateId = record.date === -1 ? 0 : record.date;
      let count = 0;
      while (
        month.records.some(
          (r) => r.id === `${yearId}-${monthId}-${dateId}-${count}`
        )
      )
        ++count;
      updRecord.id = `${yearId}-${monthId}-${dateId}-${count}`;
    }

    const [updRecords, totalAmount] = updateItem(
      month.records,
      oldId,
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

    const [updMonths, monthTotalAmount] = updateItem(
      year.months,
      updMonth.id,
      updMonth,
      (items) => items.reduce((sum, m) => sum + m.totalAmount, 0)
    );
    const updYear: Year = {
      ...year,
      months: updMonths,
      totalAmount: monthTotalAmount,
    };

    const [updYears] = updateItem(trackerYears, updYear.id, updYear, (items) =>
      items.reduce((sum, y) => sum + y.totalAmount, 0)
    );
    setTrackerYears(updYears);
    setTrackerMeta({ ...trackerMeta, updatedAt: new Date().toISOString() });
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
        {modalType === "mergeTrackerBlock" && globalBody && (
          <ModalMergeTrackerBlock />
        )}
        {modalType === "settingsBlock" && <SettingsBlock />}
      </div>
    </div>
  );
};

export default ModalBlock;
