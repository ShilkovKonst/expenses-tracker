"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import AccordionHeaderButtonBlock from "./AccordionHeaderButtonBlock";

type StickyHeaderProps = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  expandDataType: string;
  isMonth: boolean;
  expandDisabled?: boolean;
};

const AccordionStickyHeader: React.FC<StickyHeaderProps> = ({
  labelMain,
  budget,
  costs,
  balance,
  expandDataType,
  isMonth,
  expandDisabled,
}) => {
  return (
    <div
      className={`header col-span-6 grid grid-cols-7 gap-2 w-full border-2 ${
        isMonth
          ? "bg-blue-100 border-blue-200 border-t-0 sticky top-10 z-10"
          : "bg-blue-200 border-blue-300 sticky top-0 z-20"
      }`}
    >
      <div
        className={`grid-cols-5 pl-4 py-2 col-span-5 grid md:grid-cols-5 gap-2 my-auto`}
      >
        <AccordionStickyDescH3Block label={labelMain} isMonth={isMonth} />
        <AccordionStickyDescPBlock spanStyle="text-green-600" value={budget} />
        <AccordionStickyDescPBlock spanStyle="text-red-600" value={costs} />
        <AccordionStickyDescPBlock spanStyle="text-red-500" value={balance} />
      </div>
      <AccordionHeaderButtonBlock
        outerStyle="col-span-2"
        iconSize="h-4 w-4"
        buttonSize="h-6 w-8"
        expandButtonSize="h-6 w-6"
        expandDataType={expandDataType}
        expandDisabled={expandDisabled}
        isMonth={isMonth}
      />
    </div>
  );
};

export default AccordionStickyHeader;

type AccordionStickyDescPBlockProps = {
  spanStyle: string;
  value: string | number;
};

const AccordionStickyDescPBlock: React.FC<AccordionStickyDescPBlockProps> = ({
  spanStyle,
  value,
}) => {
  return (
    <div className={`flex flex-col justify-center`}>
      <span className={`font-semibold text-sm ${spanStyle}`}>{value}</span>
    </div>
  );
};

type AccordionStickyDescH3BlockProps = {
  isMonth?: boolean;
  label: string;
};

const AccordionStickyDescH3Block: React.FC<AccordionStickyDescH3BlockProps> = ({
  isMonth,
  label,
}) => {
  const { locale, selectedTag } = useGlobal();
  return (
    <div className={`col-span-2 flex justify-start items-center`}>
      <h3
        className={`text-xs sm:text-sm font-bold text-blue-800 capitalize flex flex-row justify-start items-center gap-1`}
      >
        {!isMonth && (
          <span className="max-w-20 truncate lg:max-w-max">
            {selectedTag.type === "default"
              ? t(locale, "body.form.costsTagDefault")
              : selectedTag.type}
          </span>
        )}
        <span>{label}</span>
      </h3>
    </div>
  );
};
