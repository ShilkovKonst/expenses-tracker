"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import DescH3Block from "./DescH3Block";
import DescPBlock from "./DescPBlock";
import { t } from "@/locales/locale";

type DescriptionProps = {
  labelMain: string;
  totalAmount: number;
  isMonth?: boolean;
};

const DescriptionBlock: React.FC<DescriptionProps> = ({
  labelMain,
  totalAmount,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`grid-cols-2 pl-4 py-1 col-span-4 grid md:grid-cols-5 gap-1 my-auto`}
    >
      <DescH3Block label={labelMain} />
      <DescPBlock
        spanStyle="text-red-600 text-sm"
        label={t(locale, `body.form.labels.operations`)}
        value={totalAmount}
      />
    </div>
  );
};

export default DescriptionBlock;
