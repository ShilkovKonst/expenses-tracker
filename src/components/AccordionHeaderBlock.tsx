import AccordionDescriptionBlock from "./AccordionDescriptionBlock";
import CostButton from "./CostButton";
import { AddBudget, AddCost, ExpandIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { transformElement } from "@/lib/utils/transformElement";
import { useGlobal } from "@/app/context/GlobalContext";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  expandDataType: string;
  expandDisabled: boolean;
  isMonth?: boolean;
  isSticky?: boolean;
  dataId?: string;
  dataHeader?: string;
};

const AccordionHeaderBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
  expandDataType,
  expandDisabled,
  isMonth,
  isSticky,
  dataId,
  dataHeader,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      id={dataId}
      data-month-id={dataId}
      data-month-header={dataHeader}
      className={`header col-span-6 grid grid-cols-6 gap-3 w-full border-2 ${
        !isMonth && isSticky
          ? "bg-blue-200 border-blue-300 sticky top-0 z-20"
          : isMonth && isSticky
          ? "bg-blue-100 border-blue-200 border-t-0 sticky top-10 z-10"
          : "bg-blue-100 border-blue-200 "
      }`}
    >
      <AccordionDescriptionBlock
        labelMain={`${labelMain}`}
        budget={budget}
        costs={costs}
        balance={balance}
        isSticky={isSticky}
        isMonth={isMonth}
      />
      <div
        className={`col-span-1 pr-2 gap-2 flex ${
          isSticky
            ? "flex-row justify-end items-center"
            : "flex-col justify-center items-end"
        } md:flex-row md:justify-end md:items-center *:text-sm *:md:text-base`}
      >
        <div className={`flex gap-2 justify-between items-center`}>
          <CostButton
            icon={<AddBudget style={`${isSticky ? "h-4 w-4 " : "h-6 w-6"} `} />}
            title={t(locale, `body.form.accordionAddBudget`)}
            style={`bg-blue-500 hover:bg-blue-400 ${
              isSticky ? "h-8 w-8 " : "h-10 w-10"
            }`}
            handleClick={() => {}}
          />
          {isMonth && (
            <CostButton
              icon={<AddCost style={`${isSticky ? "h-4 w-4 " : "h-6 w-6"} `} />}
              title={t(locale, `body.form.accordionAddCost`)}
              style={`bg-blue-500 hover:bg-blue-400 ${
                isSticky ? "h-8 w-8 " : "h-10 w-10"
              }`}
              handleClick={() => {}}
            />
          )}
        </div>
        <CostButton
          icon={<ExpandIcon style={`${isSticky ? "h-4 w-4 " : "h-6 w-6"} `} />}
          dataType={expandDataType}
          title={t(locale, `body.form.accordionExpandCosts`)}
          style={`bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 ${
            isSticky ? "h-8 w-8 " : "h-10 w-10"
          }`}
          handleClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
          disabled={expandDisabled}
        />
      </div>
    </div>
  );
};

export default AccordionHeaderBlock;
