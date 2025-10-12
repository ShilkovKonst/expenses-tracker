/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { Operation, Data, Month, Year } from "@/types/formTypes";
import OperationDescriptionBlock from "./OperationDescriptionBlock";
import OperationButtonBlock from "./OperationButtonBlock";
import OperationFormBlock from "./OperationFormBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/app/context/GlobalContext";
import { updateItem } from "@/lib/utils/updateDeleteHelper";

type OperationBlockProps = {
  yearMonthId: string;
  operation: Operation;
};

const OperationBlock: React.FC<OperationBlockProps> = ({
  yearMonthId,
  operation,
}) => {
  const { locale, selectedType, data, setData } = useGlobal();
  const [currentOperation, setCurrentOperation] =
    useState<Operation>(operation);
  const [oldOperation, setOldOperation] = useState<Operation | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(operation)
    setCurrentOperation(operation);
  }, [operation]);

  useEffect(() => {
    console.log(currentOperation)
    if (!currentOperation) return;
    if (!oldOperation) setOldOperation(currentOperation);
  }, [currentOperation]);

  const handleUpdateDelete = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    isDelete: boolean
  ) => {
    e.preventDefault();
    if (!currentOperation) return;
    const updOperation = {
      ...currentOperation,
      amount: Math.round(currentOperation.amount * 100) / 100,
    };

    const ids = yearMonthId.split("-");

    const currentYear = parseInt(ids[0]);
    const currentYearIndex = data.years.findIndex((y) => y.id === currentYear);
    if (currentYearIndex === -1) return;
    const year = data.years[currentYearIndex];

    const currentMonth = parseInt(ids[1]);
    const currentMonthIndex = data.years[currentYearIndex].months.findIndex(
      (m) => m.id === currentMonth
    );
    if (currentMonthIndex === -1) return;
    const month = data.years[currentYearIndex].months[currentMonthIndex];

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
    setOldOperation(isDelete ? undefined : updOperation);
    if (localStorage) {
      localStorage.setItem(selectedType.title, JSON.stringify(newFormData));
    }
  };

  return (
    <div className="cost grid gap-2 w-full">
      <div className="grid grid-cols-6 gap-3 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <OperationDescriptionBlock
          labelOperationTags={`${t(locale, `body.form.operations.tags`)}: `}
          labelOperationDescription={`${t(
            locale,
            `body.form.operations.description`
          )}: `}
          labelOperationAmount={`${t(locale, `body.form.operations.amount`)}: `}
          operationType={currentOperation.type}
          operationTags={currentOperation.tags}
          operationDescription={currentOperation.description}
          operationAmount={currentOperation.amount}
        />
        <OperationButtonBlock
          outerStyle={`col-span-1`}
          iconSize={"h-4 w-4"}
          buttonSize={"h-6 w-8"}
          expandDataType={`${yearMonthId}-${currentOperation.id}`}
          handleDelete={(e) => handleUpdateDelete(e, true)}
        />
      </div>
      <OperationFormBlock
        currentOperation={currentOperation}
        oldOperation={oldOperation}
        setCurrentOperation={setCurrentOperation}
        handleUpdate={(e) => handleUpdateDelete(e, false)}
        formId={`${yearMonthId}-${currentOperation.id}`}
      />
    </div>
  );
};

export default OperationBlock;
