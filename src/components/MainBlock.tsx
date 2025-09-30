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
} from "@/types/formTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MonthButton from "./MonthButton";
import CostButton from "./CostButton";
import { CURRENT_YEAR, MONTHS } from "@/constants";

const MainBlock = () => {
  const { locale } = useParams<{ locale: Locale }>();

  const [expenseTag, setExpenseTag] = useState<string>("home");
  const [customTag, setCustomTag] = useState<string>("");
  const [expenseTags, setExpenseTags] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthIdType | "">("");
  const [costs, setCosts] = useState<CostFormType[]>([]);
  const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    years: [],
    total: 0,
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
    const raw = localStorage.getItem(`expenses-${expenseTag}`);
    setFormData(raw ? JSON.parse(raw) : { years: [], total: 0 });
    setIsFormUpdated(false);
    setSelectedMonth("");
  }, [isFormUpdated, expenseTag]);

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

  const handleCustomTagChange = (custom: string) => {
    setCustomTag(custom);
  };

  const handleCustomTagAdd = () => {
    if (customTag) {
      const newTags = [...expenseTags, customTag];
      localStorage.setItem("expenseTags", JSON.stringify(newTags));
      setExpenseTags(newTags);
      setCustomTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return;

    const month = getMonthById(selectedMonth)!;

    const newMonth: MonthFormType = {
      title: month as Months,
      costs: costs,
      totalCosts: costs.reduce((acc, c) => acc + c.total, 0),
      budget: 0,
    };

    let currentYear = formData.years.find((y) => y.year === CURRENT_YEAR);
    if (!currentYear) {
      const emptyMonths = initEmptyMonths();
      currentYear = {
        year: CURRENT_YEAR,
        months: emptyMonths,
        totalYearCosts: 0,
        yearBudget: 0,
      };
    }

    currentYear = {
      ...currentYear,
      months: { ...currentYear.months, [selectedMonth]: newMonth },
      totalYearCosts: Object.values(currentYear.months).reduce(
        (acc, m) => acc + m.totalCosts,
        0
      ),
    };

    const updatedYears = [
      ...formData.years.filter((y) => y.year !== CURRENT_YEAR),
      currentYear,
    ];
    const total = updatedYears.reduce((acc, y) => acc + y.totalYearCosts, 0);
    const newFormData: FormType = {
      years: updatedYears,
      total: total,
    };

    setFormData(newFormData);

    localStorage.setItem(`expenses-${expenseTag}`, JSON.stringify(newFormData));
    setIsFormUpdated(true);
    alert("Saved!");
  };

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-6 mb-7">
      <div className="flex justify-between items-center w-full border-b-2 border-blue-400 pb-2">
        <h2 className="text-4xl font-semibold text-blue-950 my-auto">
          {t(locale, `body.form.title`)}
        </h2>
        <div className="">
          <p className="text-sm mb-2">
            {t(locale, `body.form.expensesTagTitle`)}
          </p>
          <div className="flex flex-col gap-2 justify-center items-start">
            <select
              id="monthSelect"
              className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
              required
              value={expenseTag}
              onChange={(e) => setExpenseTag(e.target.value)}
            >
              {expenseTags.map((tag, i) => (
                <option className={``} key={i} value={tag}>
                  {tag === "home"
                    ? t(locale, `body.form.expensesTagHome`)
                    : tag}
                </option>
              ))}
            </select>
            <div className="w-full flex justify-between gap-3 items-center">
              <input
                className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
                placeholder={t(locale, `body.form.expensesTagCustomTitle`)}
                type="text"
                value={customTag}
                onChange={(e) => handleCustomTagChange(e.target.value)}
              />
              <button
                className="text-lg font-bold px-2 py-1 bg-green-200 hover:bg-green-300 transition-colors duration-200 ease-in-out rounded"
                onClick={handleCustomTagAdd}
              >
                &#10004;
              </button>
              <button
                className="text-lg font-bold px-2 py-1 bg-red-200 hover:bg-red-300 transition-colors duration-200 ease-in-out rounded"
                onClick={() => {}}
              >
                &#10006;
              </button>
            </div>
          </div>
        </div>
      </div>
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
            style="bg-green-400 hover:bg-green-500"
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
