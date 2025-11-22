"use client";
import { useGlobal } from "@/context/GlobalContext";
import DescH3Block from "./DescH3Block";
import DescPBlock from "./DescPBlock";
import { t } from "@/locales/locale";
import { intToDecimalString } from "@/lib/utils/amountHelper";

type DescriptionProps = {
  labelMain: string;
  totalAmount: number;
  totalRecords: number;
  isMonth?: boolean;
};

const DescriptionBlock: React.FC<DescriptionProps> = ({
  labelMain,
  totalRecords,
  totalAmount,
}) => {
  const { locale } = useGlobal();
  return (
    <div className={`col-span-4 grid grid-cols-2 pl-4 py-1 gap-1 my-auto`}>
      <DescH3Block label={labelMain} totalRecords={totalRecords} />
      <DescPBlock
        outerStyle="flex flex-col md:flex-row justify-center items-start md:items-center gap-1"
        spanStyle={
          totalAmount > 0 ? `text-green-600 text-sm` : `text-red-600 text-sm`
        }
        label={`${t(locale, `body.form.labels.outcome`)}:`}
        value={intToDecimalString(totalAmount)}
      />
    </div>
  );
};

export default DescriptionBlock;
