"use client";
import { Data, Month, Operation, Year } from "@/types/formTypes";
import FormOperationBlock from "./formComponents/FormOperationBlock";
import { useGlobal } from "@/context/GlobalContext";
import { updateItem } from "@/lib/utils/updateDeleteHelper";
import { useModal } from "@/context/ModalContext";
import FormDeleteBlock from "./formComponents/FormDeleteBlock";
import { CURRENT_YEAR } from "@/lib/constants";
import { MouseEvent, TouchEvent } from "react";

const ModalFormBlock: React.FC = () => {
  const { selectedType, data, setData } = useGlobal();
  const { setIsModal, formModalBody, setFormModalBody } = useModal();

  const handleClear = () => {
    setFormModalBody(null);
    setIsModal(false);
  };

  const handleUpdateDelete = (operation: Operation, isDelete: boolean) => {
    if (!formModalBody) return;
    const { yearId, monthId } = formModalBody;

    const updOperation = {
      ...operation,
      amount: Math.round(operation.amount * 100) / 100,
    };
    const yearIdx = CURRENT_YEAR - yearId;
    if (yearIdx < 0) return;
    const year = data.years[yearIdx];
    if (!monthId) return;
    const month = data.years[yearIdx].months[monthId - 1];

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
      data.years,
      updYear,
      (items) => items.reduce((sum, y) => sum + y.totalAmount, 0)
    );
    const newFormData: Data = {
      ...data,
      id: data.id === selectedType.title ? data.id : selectedType.title,
      years: updYears,
      totalAmount: yearTotalAmount,
    };
    setData(newFormData);
    if (localStorage) {
      localStorage.setItem(selectedType.title, JSON.stringify(newFormData));
    }
    handleClear();
  };

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const form = target.closest(".form");
    if (form) {
      return;
    }
    const foreground = target.closest("#foreground");
    if (foreground) {
      handleClear();
      return;
    }
  };

  return (
    <div
      id="foreground"
      onClick={(e) => handleClick(e)}
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      {formModalBody &&
        (formModalBody.type === "udp" || formModalBody.type === "crt" ? (
          <FormOperationBlock
            handleUpdate={handleUpdateDelete}
            handleClear={handleClear}
            operation={formModalBody.operation}
          />)
          : formModalBody.type === "del" ? (
            <FormDeleteBlock
              handleDelete={handleUpdateDelete}
              handleClear={handleClear}
            />
          ) : (<></>))}
    </div>
  );
};

export default ModalFormBlock;
