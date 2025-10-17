"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import HeaderButtonBlock from "./HeaderButtonBlock";

type StickyHeaderProps = {
  labelMain: string;
  totalAmount: number;
  expandDataType: string;
  isMonth: boolean;
  expandDisabled?: boolean;
};

const StickyHeader: React.FC<StickyHeaderProps> = ({
  labelMain,
  totalAmount,
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
        <StickyDescH3Block label={labelMain} isMonth={isMonth} />
        <StickyDescPBlock spanStyle="text-red-600" value={totalAmount} />
      </div>
      <HeaderButtonBlock
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

export default StickyHeader;

type StickyDescPBlockProps = {
  spanStyle: string;
  value: string | number;
};

const StickyDescPBlock: React.FC<StickyDescPBlockProps> = ({
  spanStyle,
  value,
}) => {
  return (
    <div className={`flex flex-col justify-center`}>
      <span className={`font-semibold text-sm ${spanStyle}`}>{value}</span>
    </div>
  );
};

type StickyDescH3BlockProps = {
  isMonth?: boolean;
  label: string;
};

const StickyDescH3Block: React.FC<StickyDescH3BlockProps> = ({
  isMonth,
  label,
}) => {
  const { locale, selectedType } = useGlobal();
  return (
    <div className={`col-span-2 flex justify-start items-center`}>
      <h3
        className={`text-xs sm:text-sm font-bold text-blue-800 capitalize flex flex-row justify-start items-center gap-1`}
      >
        {!isMonth && (
          <span className="max-w-20 truncate lg:max-w-max">
            {selectedType.title === "default"
              ? t(locale, "body.form.data.typeDefault")
              : selectedType.title}
          </span>
        )}
        <span>{label}</span>
      </h3>
    </div>
  );
};
