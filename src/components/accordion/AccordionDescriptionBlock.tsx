"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import AccordionDescH3Block from "./AccordionDescH3Block";
import AccordionDescPBlock from "./AccordionDescPBlock";
import { t } from "@/locales/locale";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  isMonth?: boolean;
};

const AccordionDescriptionBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`grid-cols-2 pl-4 py-1 col-span-4 grid md:grid-cols-5 gap-1 my-auto`}
    >
      <AccordionDescH3Block label={labelMain} />
      <AccordionDescPBlock
        spanStyle="text-green-600 text-sm"
        label={t(locale, `body.form.labels.budget`)}
        value={budget}
      />
      <AccordionDescPBlock
        spanStyle="text-red-600 text-sm"
        label={t(locale, `body.form.labels.costs`)}
        value={costs}
      />
      <AccordionDescPBlock
        spanStyle="text-red-500 text-sm"
        label={t(locale, `body.form.labels.balance`)}
        value={balance}
      />
    </div>
  );
};

export default AccordionDescriptionBlock;
