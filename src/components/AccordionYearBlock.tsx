import { Locale, t } from "@/locales/locale";
import { CostFormType, YearFormType } from "@/types/formTypes";
import { Dispatch, SetStateAction } from "react";
import AccordionMonthBlock from "./AccordionMonthBlock";
import CostButton from "./CostButton";
import { transformElement } from "@/lib/utils/transformElement";
import AccordionDescriptionBlock from "./AccordionDescriptionBlock";
import { AddBudget, ExpandIcon } from "@/lib/icons";

type AccordionYearBlockPropsType = {
  locale: Locale;
  year: [string, YearFormType];
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionYearBlock: React.FC<AccordionYearBlockPropsType> = ({
  locale,
  year,
  costs,
  setCosts,
}) => {
  return (
    <div
      key={year[0]}
      className="year grid grid-cols-6 gap-2 w-full *:col-span-6"
    >
      <div
        data-type={`year`}
        data-year={year[0]}
        className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-200 border-2 border-blue-300 sticky top-0 z-2"
      >
        <AccordionDescriptionBlock
          labelMain={`${t(locale, `body.form.labels.year`)}: ${year[0]}`}
          labelBudget={`${t(locale, `body.form.labels.budget`)}: `}
          labelCosts={`${t(locale, `body.form.costs`)}: `}
          labelBalance={`${t(locale, `body.form.labels.balance`)}: `}
          budget={year[1].budget ?? 0}
          costs={year[1].costs}
          balance={year[1].balance ?? 0}
        />
        <div className="col-span-2 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
          <CostButton
            icon={<AddBudget style="h-7 w-7" />}
            dataType=""
            dataUpdate=""
            title={t(locale, `body.form.accordionAddBudget`)}
            style="bg-blue-500 hover:bg-blue-400 h-11 w-11"
            handleClick={() => {}}
          />
          <CostButton
            icon={<ExpandIcon style="h-7 w-7" />}
            dataType={`${year[0]}`}
            dataUpdate=""
            title={t(locale, `body.form.accordionExpandCosts`)}
            style="bg-blue-400 hover:bg-blue-500 disabled:text-gray-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-11 w-11"
            handleClick={(e) =>
              transformElement(e.target as HTMLElement, "data-type")
            }
            disabled={Object.keys(year[1].months).length === 0}
          />
        </div>
      </div>
      <div
        id={year[0]}
        style={{ height: 0 }}
        className="pl-4 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {Object.entries(year[1].months).map((month) => (
          <AccordionMonthBlock
            key={month[0]}
            locale={locale}
            year={year}
            month={month}
            costs={costs}
            setCosts={setCosts}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default AccordionYearBlock;
