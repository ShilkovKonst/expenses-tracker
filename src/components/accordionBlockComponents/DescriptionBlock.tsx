"use client";
import { t } from "@/locales/locale";
import DescPBlock from "@/components/descriptionComponents/DescPBlock";
import DescH3Block from "@/components/descriptionComponents/DescH3Block";
import { useGlobal } from "@/context/GlobalContext";
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
        title={`${t(locale, `body.form.labels.outcome`)}:`}
        value={intToDecimalString(totalAmount)}
        valueStyle={`font-semibold
          ${
            totalAmount > 0 ? `text-green-600 text-sm` : `text-red-600 text-sm`
          }`}
      />
    </div>
  );
};

export default DescriptionBlock;
