"use client";
import { Month, MonthRecord, Year } from "@/types/formTypes";
import RecordForm from "./formComponents/RecordForm";
import { updateItem } from "@/lib/utils/updateDeleteHelper";
import { useModal } from "@/context/ModalContext";
import FormDeleteBlock from "./formComponents/FormDeleteBlock";
import { CURRENT_YEAR } from "@/lib/constants";
import SettingsBlock from "./settingsBlockComponents/SettingsBlock";
import { useTracker } from "@/context/TrackerContext";

const ModalFormBlock: React.FC = () => {
  const { trackerMeta, trackerYears, setTrackerMeta, setTrackerYears } =
    useTracker();
  const { setIsModal, formModalBody, setFormModalBody, isSettingsModal } =
    useModal();

  const handleClear = () => {
    setFormModalBody(null);
    setIsModal(false);
  };

  const handleUpdateDelete = (record: MonthRecord, isDelete: boolean) => {
    if (!formModalBody) return;
    if (!trackerMeta || !trackerYears) return;

    const { yearId, monthId } = formModalBody;
    if (!yearId || !monthId) return;

    const yearIdx = CURRENT_YEAR - yearId;
    if (yearIdx < 0) return;
    const year = trackerYears[yearIdx];
    if (!year) return;
    const month = year.months[monthId - 1];
    if (!month) return;

    const updRecord = {
      ...record,
    };

    const oldRecord = month.records.find((r) => r.id === record.id);
    const oldId = record.id;
    if (
      formModalBody.type === "crt" ||
      (formModalBody.type === "upd" &&
        oldRecord &&
        oldRecord.date !== record.date)
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
        {formModalBody &&
          (formModalBody.type === "upd" || formModalBody.type === "crt" ? (
            <RecordForm
              handleUpdate={handleUpdateDelete}
              handleClear={handleClear}
            />
          ) : formModalBody.type === "del" ? (
            <FormDeleteBlock
              deleteEntity="record"
              handleDelete={handleUpdateDelete}
              handleClear={handleClear}
            />
          ) : (
            <></>
          ))}
        {isSettingsModal && <SettingsBlock handleClear={handleClear} />}
      </div>
    </div>
  );
};

export default ModalFormBlock;
