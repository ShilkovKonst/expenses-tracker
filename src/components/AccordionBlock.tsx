import { CostFormType, FormType } from "@/types/formTypes";
import React, { Dispatch, MouseEvent, SetStateAction, TouchEvent } from "react";
import { Locale } from "@/locales/locale";
import AccordionYearBlock from "./AccordionYearBlock";

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
		console.log(target)
		console.log(type)
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

function transformElement(element: HTMLElement, attribute: string) {
  const id = element.getAttribute(attribute);
  if (id) {
    const subElement = document.getElementById(id);
    if (subElement) {
      const computedHeight = parseFloat(getComputedStyle(subElement).height);
      if (computedHeight > 0) {
        subElement.style.height = `${subElement.scrollHeight}px`;
        requestAnimationFrame(() => {
          subElement.style.height = "0";
        });
      } else {
        subElement.style.height = "0";
        requestAnimationFrame(() => {
          subElement.style.height = `${subElement.scrollHeight}px`;
        });
        const handleTransitionEnd = () => {
          subElement.style.height = "auto";
          subElement.removeEventListener("transitionend", handleTransitionEnd);
        };
        subElement.addEventListener("transitionend", handleTransitionEnd);
      }
    }
  }
}
