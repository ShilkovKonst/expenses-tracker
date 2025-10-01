"use client";
import { Locale, t } from "@/locales/locale";
import FormSelectBlock from "./FormSelectBlock";
import MonthButton from "./MonthButton";
import { CURRENT_YEAR, MONTHS } from "@/constants";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CostFormType, MonthIdType } from "@/types/formTypes";
import TagsBlock from "./TagsBlock";

type FormMonthBlockProps = {
  locale: Locale;
  selectedMonth: MonthIdType | "";
  setSelectedMonth: Dispatch<SetStateAction<MonthIdType | "">>;
  selectedTag: string;
  setSelectedTag: Dispatch<SetStateAction<string>>;
  expenseTags: string[];
  setExpenseTags: Dispatch<SetStateAction<string[]>>;
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const FormMonthBlock: React.FC<FormMonthBlockProps> = ({
  locale,
  selectedMonth,
  setSelectedMonth,
  selectedTag,
  setSelectedTag,
  expenseTags,
  setExpenseTags,
  setCosts,
}) => {
  const handleSetMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value) as MonthIdType);
  };

  const handleClearMonth = () => {
    setSelectedMonth("");
    setCosts([]);
  };

  return (
    <div className="pt-2">
      <h3 className="text-blue-900 mb-1 font-bold text-lg uppercase text-center">
        {t(locale, `body.form.labelYear`)} : {CURRENT_YEAR},{" "}
        {t(locale, `body.form.expenses`)} :{" "}
        {selectedTag === "home"
          ? t(locale, `body.form.expensesTagHome`)
          : selectedTag}
      </h3>
      <div className="flex gap-4 mb-4 sm:justify-between lg:justify-evenly items-center">
        <div className="flex flex-col gap-4 items-start justify-center">
          <FormSelectBlock
            locale={locale}
            id="monthSelect"
            style="px-3 py-2 h-11 text-base capitalize *:capitalize"
            withLabel={true}
            value={selectedMonth}
            options={MONTHS}
            titleLable={"labelMonth"}
            titleOptionsInit="selectMonth"
            titleOptions="valueMonth"
            onChange={(e) => handleSetMonth(e)}
          />
          <div className="flex gap-2 justify-between items-center">
            <MonthButton
              title={t(locale, `body.form.createMonth`)}
              style="bg-green-400 hover:bg-green-500"
              isSubmit={true}
              disabled={false}
            />
            <MonthButton
              title={t(locale, `body.form.clearMonth`)}
              style="bg-red-400 hover:bg-red-500"
              handleClick={handleClearMonth}
              disabled={false}
            />
          </div>
        </div>

        <TagsBlock
          locale={locale}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          expenseTags={expenseTags}
          setExpenseTags={setExpenseTags}
        />
      </div>
    </div>
  );
};

export default FormMonthBlock;
