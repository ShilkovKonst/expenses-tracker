"use client";
import { Tracker, Month, Record, Year } from "@/types/formTypes";
import FormOperationBlock from "./formComponents/FormRecordBlock";
import { useGlobal } from "@/context/GlobalContext";
import { updateItem } from "@/lib/utils/updateDeleteHelper";
import { useModal } from "@/context/ModalContext";
import FormDeleteBlock from "./formComponents/FormDeleteBlock";
import { CURRENT_YEAR } from "@/lib/constants";
import SettingsBlock from "./settingsBlockComponents/SettingsBlock";

const ModalFormBlock: React.FC = () => {
  const { selectedType, tracker, setTracker } = useGlobal();
  const { setIsModal, formModalBody, setFormModalBody, isSettingsModal } =
    useModal();

  const handleClear = () => {
    setFormModalBody(null);
    setIsModal(false);
  };

  const handleUpdateDelete = (operation: Record, isDelete: boolean) => {
    if (!formModalBody) return;
    const { yearId, monthId } = formModalBody;

    const updOperation = {
      ...operation,
      amount: Math.round(operation.amount * 100) / 100,
    };
    const yearIdx = CURRENT_YEAR - yearId;
    if (yearIdx < 0) return;
    const year = tracker.years[yearIdx];
    if (!monthId) return;
    const month = tracker.years[yearIdx].months[monthId - 1];

    const [updOperations, totalAmount] = updateItem(
      month.operations,
      updOperation,
      (items) =>
        items.reduce(
          (sum, c) => (c.type === "income" ? sum + c.amount : sum - c.amount),
          0
        ),
      isDelete
    );
    const updMonth: Month = {
      ...month,
      operations: updOperations,
      totalAmount: totalAmount,
    };

    const [updMonths, monthTotalAmount] = updateItem(
      year.months,
      updMonth,
      (items) => items.reduce((sum, m) => sum + m.totalAmount, 0)
    );
    const updYear: Year = {
      ...year,
      months: updMonths,
      totalAmount: monthTotalAmount,
    };

    const [updYears, yearTotalAmount] = updateItem(
      tracker.years,
      updYear,
      (items) => items.reduce((sum, y) => sum + y.totalAmount, 0)
    );
    const newTracker: Tracker = {
      ...tracker,
      id: tracker.id === selectedType.title ? tracker.id : selectedType.title,
      years: updYears,
      totalAmount: yearTotalAmount,
    };
    setTracker(newTracker);
    if (localStorage) {
      localStorage.setItem(selectedType.title, JSON.stringify(newTracker));
    }
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
            <FormOperationBlock
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
