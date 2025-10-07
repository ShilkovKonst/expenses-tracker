import React, { Dispatch, SetStateAction } from "react";
import AccordionCostBlock from "./AccordionCostBlock";
import CostButton from "./CostButton";
import { Locale, t } from "@/locales/locale";
import { CostFormType, MonthFormType, YearFormType } from "@/types/formTypes";
import { transformElement } from "@/lib/utils/transformElement";
import AccordionDescriptionBlock from "./AccordionDescriptionBlock";
import { AddBudget, AddCost, ExpandIcon } from "@/lib/icons";

type AccordionMonthBlockPropsType = {
  locale: Locale;
  year: [string, YearFormType];
  month: [string, MonthFormType];
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionMonthBlock: React.FC<AccordionMonthBlockPropsType> = ({
  locale,
  year,
  month,
  costs,
  setCosts,
}) => {
  return (
    <div key={month[0]} className="month grid grid-cols-6 gap-2 w-full">
      <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-100 border-2 border-blue-200 sticky top-0 z-1">
        <AccordionDescriptionBlock
          labelMain={`${t(locale, `body.form.valueMonth.${month[1].title}`)}`}
          labelBudget={`${t(locale, `body.form.labels.budget`)}: `}
          labelCosts={`${t(locale, `body.form.labels.costs`)}: `}
          labelBalance={`${t(locale, `body.form.labels.balance`)}: `}
          budget={month[1].budget ?? 0}
          costs={month[1].monthCosts}
          balance={month[1].balance ?? 0}
        />
        <div className="col-span-2 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
          <div className="flex gap-2 justify-between items-center">
            <CostButton
              icon={<AddBudget style="h-7 w-7" />}
              dataType=""
              dataUpdate=""
              title={t(locale, `body.form.accordionAddBudget`)}
              style="bg-blue-500 hover:bg-blue-400 h-11 w-11"
              handleClick={() => {}}
            />
            <CostButton
              icon={<AddCost style="h-7 w-7" />}
              dataType=""
              dataUpdate=""
              title={t(locale, `body.form.accordionAddCost`)}
              style="bg-blue-500 hover:bg-blue-400 h-11 w-11"
              handleClick={() => {}}
            />
          </div>
          <CostButton
            icon={<ExpandIcon style="h-7 w-7" />}
            dataType={`${year[0]}-${month[0]}`}
            dataUpdate=""
            title={t(locale, `body.form.accordionExpandCosts`)}
            style="bg-blue-400 hover:bg-blue-500 disabled:text-gray-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-11 w-11"
            handleClick={(e) => {
              console.log("test");
              transformElement(e.target as HTMLElement, "data-type");
            }}
            disabled={month[1].costs.length === 0}
          />
        </div>
      </div>
      <div
        id={`${year[0]}-${month[0]}`}
        style={{ height: 0 }}
        className="col-span-6 pl-4 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {month[1].costs.map((cost, index) => (
          <AccordionCostBlock
            key={index}
            locale={locale}
            index={index}
            year={year}
            month={month}
            cost={cost}
            costs={costs}
            setCosts={setCosts}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default AccordionMonthBlock;
