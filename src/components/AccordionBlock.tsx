import { CostFormType, FormType } from "@/types/formTypes";
import React, { Dispatch, MouseEvent, SetStateAction, TouchEvent } from "react";
import { Locale } from "@/locales/locale";
import AccordionYearBlock from "./AccordionYearBlock";
import { transformElement } from "@/lib/utils/transformElement";

type AccordionBlockPropsType = {
  formData: FormType;
  locale: Locale;
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionBlock: React.FC<AccordionBlockPropsType> = ({
  formData,
  locale,
  costs,
  setCosts,
}) => {
  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const type = target.getAttribute("data-type");
    if (target instanceof HTMLElement) {
      if (type === "year") {
        transformElement(target, "data-year");
        return;
      }
      if (type === "month") {
        transformElement(target, "data-month");
        return;
      }
      if (type === "update") {
        transformElement(target, "data-update");
        return;
      }
    }

    if (target instanceof HTMLElement) {
      transformElement(target, "data-month");
      return;
    }
  };

  return (
    <div className="w-full" onClick={(e) => handleClick(e)}>
      {Object.entries(formData.years).map((year) => (
        <AccordionYearBlock
          key={year[0]}
          locale={locale}
          year={year}
          costs={costs}
          setCosts={setCosts}
        />
      ))}
    </div>
  );
};

export default AccordionBlock;
