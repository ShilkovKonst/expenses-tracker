/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getMonthById } from "@/lib/utils/monthHelper";
import { Locale, t } from "@/locales/locale";
import {
  CostFormType,
  FormType,
  MonthFormType,
  MonthIdType,
  Months,
} from "@/types/formTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MonthButton from "./MonthButton";
import CostButton from "./CostButton";
import { CURRENT_YEAR, MONTHS } from "@/constants";

const MainBlock = () => {
  const { locale } = useParams<{ locale: Locale }>();

  const [selectedMonth, setSelectedMonth] = useState<MonthIdType | "">("");
  const [costs, setCosts] = useState<CostFormType[]>([]);
  const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    years: [],
    total: 0,
  });

  useEffect(() => {
    const raw = localStorage.getItem("expensesForm");
    setFormData(raw ? JSON.parse(raw) : { years: [], total: 0 });
    setIsFormUpdated(false);
  }, [isFormUpdated]);

  useEffect(() => {
    if (!selectedMonth) {
      setCosts([]);
      return;
    }
    const currentYear = formData.years.find((y) => y.year === CURRENT_YEAR);
    const month = currentYear?.months[selectedMonth];
    setCosts(month?.costs ?? [{ title: "", type: "", total: 0 }]);
  }, [selectedMonth]);

  const handleAddCost = () => {
    setCosts([...costs, { title: "", type: "", total: 0 }]);
  };

  const handleRemoveCost = (i: number) => {
    setCosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
  };

  const handleClearMonth = () => {
    setSelectedMonth("");
    setCosts([]);
  };

  const handleCostChange = (
    index: number,
    field: keyof CostFormType,
    value: string
  ) => {
    const newCosts = [...costs];
    if (field === "total" && value.match(/^\d*$/)) {
      newCosts[index][field] = Number(value);
    }
    if (field !== "total") {
      newCosts[index][field] = value;
    }
    setCosts(newCosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return;

    const month = getMonthById(selectedMonth)!;

    const newMonth: MonthFormType = {
      title: month as Months,
      costs: costs,
      total: costs.reduce((acc, c) => acc + c.total, 0),
    };

    let currentYear = formData.years.find((y) => y.year === CURRENT_YEAR);
    if (!currentYear) {
      const emptyMonths: Record<MonthIdType, MonthFormType> = {} as Record<
        MonthIdType,
        MonthFormType
      >;
      for (let i = 1 as MonthIdType; i <= 12; i++) {
        emptyMonths[i] = { title: getMonthById(i), costs: [], total: 0 };
      }
      currentYear = {
        year: CURRENT_YEAR,
        months: emptyMonths,
        total: 0,
      };
    }

    currentYear.months[selectedMonth] = newMonth;
    currentYear.total = Object.values(currentYear.months).reduce(
      (acc, m) => acc + m.total,
      0
    );

    const updatedYears = [
      ...formData.years.filter((y) => y.year !== CURRENT_YEAR),
      currentYear,
    ];
    const total = updatedYears.reduce((acc, y) => acc + y.total, 0);
    const newFormData: FormType = {
      years: updatedYears,
      total: total,
    };

    setFormData(newFormData);

    localStorage.setItem("expensesForm", JSON.stringify(newFormData));
    setIsFormUpdated(true);
    alert("Saved!");
  };

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-6 mb-7">
      <h2 className="text-xl font-semibold text-blue-950 mb-5 border-b-2 border-blue-400 pb-2">
        {t(locale, `body.form.title`)}
      </h2>
      <form onSubmit={handleSubmit} id="monthForm">
        <div className="flex gap-4 mb-4 items-end">
          <div className="flex-1 *:capitalize">
            <label
              className="block font-semibold text-blue-900 mb-1 text-lg uppercase"
              htmlFor="monthSelect"
            >
              {t(locale, `body.form.labelMonth`)}
            </label>
            <select
              id="monthSelect"
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-md text-base transition-colors duration-200 bg-white"
              required
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(Number(e.target.value) as MonthIdType)
              }
            >
              <option value={""}>{t(locale, `body.form.selectMonth`)}</option>
              {MONTHS.map((m) => (
                <option className={``} key={m.id} value={m.id}>
                  {t(locale, `body.form.valueMonth.${m.title}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 *:capitalize">
            <label
              className="block font-semibold text-blue-900 mb-1 text-lg uppercase"
              htmlFor="yearInput"
            >
              {t(locale, `body.form.labelYear`)}
            </label>
            <input
              id="yearInput"
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-md text-base transition-colors duration-200 ease-in-out bg-white"
              type="number"
              value={CURRENT_YEAR}
              disabled
            />
          </div>
          <MonthButton
            title={t(locale, `body.form.createMonth`)}
            style="bg-blue-400 hover:bg-blue-500"
            isSubmit={true}
          />
          <MonthButton
            title={t(locale, `body.form.clearMonth`)}
            style="bg-red-400 hover:bg-red-500"
            handleClick={handleClearMonth}
          />
        </div>

        {selectedMonth && (
          <div className="mt-6">
            <h3 className="font-semibold text-blue-900">
              {t(locale, `body.form.expenses`)}
            </h3>

            {costs.map((cost, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 items-end py-2 border-b border-blue-300"
              >
                <div>
                  <label className="block text-sm font-semibold">
                    {t(locale, `body.form.expensesTitle`)}
                  </label>
                  <input
                    className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
                    type="text"
                    value={cost.title}
                    onChange={(e) =>
                      handleCostChange(i, "title", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    {t(locale, `body.form.expensesType`)}
                  </label>
                  <input
                    className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
                    type="text"
                    value={cost.type}
                    onChange={(e) =>
                      handleCostChange(i, "type", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    {t(locale, `body.form.expensesAmount`)}
                  </label>
                  <input
                    className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
                    type="text"
                    value={cost.total}
                    onChange={(e) =>
                      handleCostChange(i, "total", e.target.value)
                    }
                    required
                  />
                </div>
                <CostButton
                  title={t(locale, `body.form.expensesRemove`)}
                  style="bg-red-200 hover:bg-red-300"
                  handleClick={() => handleRemoveCost(i)}
                />
              </div>
            ))}
            <CostButton
              title={t(locale, `body.form.expensesAdd`)}
              style="bg-blue-200 hover:bg-blue-300"
              handleClick={handleAddCost}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default MainBlock;
