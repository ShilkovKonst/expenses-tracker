/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import {
  CostFormType,
  FormDataType,
  MonthFormType,
  YearFormType,
} from "@/types/formTypes";
import AccordionCostDescriptionBlock from "./AccordionCostDescriptionBlock";
import AccordionCostButtonBlock from "./AccordionCostButtonBlock";
import AccordionCostFormBlock from "./AccordionCostFormBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/app/context/GlobalContext";
import { updateItem } from "@/lib/utils/updateDeleteHelper";

type AccordionCostBlockPropsType = {
  yearMonthId: string;
  cost: CostFormType;
};

const AccordionCostBlock: React.FC<AccordionCostBlockPropsType> = ({
  yearMonthId,
  cost,
}) => {
  const { locale, selectedTag, formData, setFormData } = useGlobal();
  const [currentCost, setCurrentCost] = useState<CostFormType>(cost);
  const [oldCost, setOldCost] = useState<CostFormType | undefined>(undefined);

  useEffect(() => {
    if (!currentCost) return;
    if (!oldCost) setOldCost(currentCost);
  }, [currentCost]);

  useEffect(() => {
    if (!cost) return;
    setCurrentCost(cost);
  }, [cost]);

  const handleUpdateDelete = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    isDelete: boolean
  ) => {
    e.preventDefault();
    if (!currentCost) return;
    const processedCost = {
      ...currentCost,
      amount: Math.round(currentCost.amount * 100) / 100,
    };

    const ids = yearMonthId.split("-");

    const currentYear = parseInt(ids[0]);
    const currentYearIndex = formData.years.findIndex(
      (y) => y.id === currentYear
    );
    if (currentYearIndex === -1) return;
    const year = formData.years[currentYearIndex];

    const currentMonth = parseInt(ids[1]);
    const currentMonthIndex = formData.years[currentYearIndex].months.findIndex(
      (m) => m.id === currentMonth
    );
    if (currentMonthIndex === -1) return;
    const month = formData.years[currentYearIndex].months[currentMonthIndex];

    const [updCosts, costsAmount] = updateItem(
      month.costs,
      processedCost,
      (items) => items.reduce((sum, c) => sum + c.amount, 0),
      isDelete
    );
    const updMonth: MonthFormType = {
      ...month,
      costs: updCosts,
      costsAmount: costsAmount,
    };

    const [updMonths, monthsCostsAmount] = updateItem(
      year.months,
      updMonth,
      (items) => items.reduce((sum, m) => sum + m.costsAmount, 0)
    );
    const updYear: YearFormType = {
      ...year,
      months: updMonths,
      costs: monthsCostsAmount,
    };

    const [updYears, yearsCostsAmount] = updateItem(
      formData.years,
      updYear,
      (items) => items.reduce((sum, y) => sum + y.costs, 0)
    );
    const newFormData: FormDataType = {
      ...formData,
      id: formData.id === selectedTag.type ? formData.id : selectedTag.type,
      years: updYears,
      totalCosts: yearsCostsAmount,
    };
    setFormData(newFormData);
    setOldCost(isDelete ? undefined : processedCost);
    if (localStorage) {
      localStorage.setItem(selectedTag.type, JSON.stringify(newFormData));
    }
  };

  return (
    <div className="cost grid grid-cols-6 gap-2 w-full">
      <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <AccordionCostDescriptionBlock
          labelCostType={`${t(locale, `body.form.costType`)}: `}
          labelCostDescription={`${t(locale, `body.form.costDescription`)}: `}
          labelCostAmount={`${t(locale, `body.form.costAmount`)}: `}
          costType={currentCost.type}
          costDescription={currentCost.description}
          costAmount={currentCost.amount}
        />
        <AccordionCostButtonBlock
          outerStyle={`col-span-1`}
          iconSize={"h-4 w-4"}
          buttonSize={"h-6 w-8"}
          expandDataType={`${yearMonthId}-${currentCost.id}-${currentCost.type}-${currentCost.amount}`}
          handleDelete={(e) => handleUpdateDelete(e, true)}
        />
      </div>
      <AccordionCostFormBlock
        currentCost={currentCost}
        oldCost={oldCost}
        setCurrentCost={setCurrentCost}
        handleUpdate={(e) => handleUpdateDelete(e, false)}
        formId={`${yearMonthId}-${currentCost.id}-${currentCost.type}-${currentCost.amount}`}
      />
    </div>
  );
};

export default AccordionCostBlock;
