/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getMonthById, initEmptyMonths } from "@/lib/utils/monthHelper";
import { Locale, t } from "@/locales/locale";
import {
  CostFormType,
  FormType,
  MonthFormType,
  MonthIdType,
  Months,
  YearFormType,
} from "@/types/formTypes";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CURRENT_YEAR } from "@/constants";
import FormCostsBlock from "./FormCostsBlock";
import FormMonthBlock from "./FormMonthBlock";
import AccordionBlock from "./AccordionBlock";

const MainBlock = () => {
  const { locale } = useParams<{ locale: Locale }>();

  const [selectedTag, setSelectedTag] = useState<string>("home");
  const [expenseTags, setExpenseTags] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthIdType | "">("");
  const [costs, setCosts] = useState<CostFormType[]>([]);
  const [monthBudget, setMonthBudget] = useState<number>(0);
  const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    years: {} as Record<number, YearFormType>,
    totalCosts: 0,
  });

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem("expenseTags");
      if (!raw) localStorage.setItem("expenseTags", JSON.stringify(["home"]));
      const tags: string[] = raw ? JSON.parse(raw) : ["home"];
      setExpenseTags(tags);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`expenses-${selectedTag}`);
    setFormData(raw ? JSON.parse(raw) : { years: [], total: 0 });
    setIsFormUpdated(false);
    setSelectedMonth("");
  }, [isFormUpdated, selectedTag]);

  useEffect(() => {
    if (!selectedMonth) {
      setCosts([]);
      return;
    }
    const currentYear = formData.years[CURRENT_YEAR];
    const month = currentYear?.months[selectedMonth];
    setCosts(
      month?.costs?.length > 0
        ? month?.costs
        : [{ title: "", type: "", amount: 0 }]
    );
  }, [selectedMonth]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return;

    const month = getMonthById(selectedMonth)!;
    const newMonth: MonthFormType = {
      title: month as Months,
      costs: costs,
      monthCosts: costs.reduce((acc, c) => acc + c.amount, 0),
      budget: monthBudget,
    };

    let currentYear = defineCurrentYearData(formData);
    const updatedMonths = { ...currentYear.months, [selectedMonth]: newMonth };
    currentYear = {
      ...currentYear,
      months: updatedMonths,
      yearCosts: Object.values(updatedMonths).reduce(
        (acc, m) => acc + m.monthCosts,
        0
      ),
    };

    const newFormData = getNewFormData(formData, currentYear);
    setFormData(newFormData);
    localStorage.setItem(
      `expenses-${selectedTag}`,
      JSON.stringify(newFormData)
    );

    setIsFormUpdated(true);
  };

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-6 mb-7">
      <div className="flex justify-between items-center w-full border-b-6 border-blue-400 pb-2">
        <h2 className="text-4xl font-semibold text-blue-950 my-auto">
          {t(locale, `body.form.title`)}
        </h2>
      </div>
      <form onSubmit={handleSubmit} id="monthForm">
        <FormMonthBlock
          locale={locale}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          expenseTags={expenseTags}
          setExpenseTags={setExpenseTags}
          setCosts={setCosts}
        />

        {Number(selectedMonth) > 0 && (
          <FormCostsBlock
            locale={locale}
            costs={costs}
            setCosts={setCosts}
            inputStyles={["text-xs", "px-2 py-1 text-sm"]}
          />
        )}
      </form>
      <AccordionBlock
        formData={formData}
        locale={locale}
        costs={costs}
        setCosts={setCosts}
      />
    </div>
  );
};

export default MainBlock;

function defineCurrentYearData(formData: FormType): YearFormType {
  let currentYear = formData.years[CURRENT_YEAR];
  if (!currentYear) {
    const emptyMonths = initEmptyMonths();
    currentYear = {
      months: emptyMonths,
      yearCosts: 0,
      yearBudget: 0,
    };
  }
  return currentYear;
}

function getNewFormData(
  formData: FormType,
  currentYear: YearFormType
): FormType {
  const updatedYears = {
    ...formData.years,
    [CURRENT_YEAR]: currentYear,
  };
  const newFormData: FormType = {
    years: updatedYears,
    totalCosts: Object.values(updatedYears).reduce(
      (acc, year) => acc + year.yearCosts,
      0
    ),
  };
  return newFormData;
}
