"use client";
import { MonthFormType, YearFormType } from "@/types/formTypes";
import { useEffect, useRef, useState } from "react";
import AccordionYearBlock from "./AccordionYearBlock";
import AccordionStickyHeader from "./AccordionStickyHeader";
import { t } from "@/locales/locale";
import { useGlobal } from "@/app/context/GlobalContext";
import {
  onScrollMonthHelper,
  onScrollSetter,
  onScrollYearHelper,
} from "@/lib/utils/onScrollHelper";

const AccordionBlock: React.FC = () => {
  const { locale, formData } = useGlobal();
  const [activeMonth, setActiveMonth] = useState<MonthFormType | undefined>(
    undefined
  );
  const [activeYear, setActiveYear] = useState<YearFormType | undefined>(
    undefined
  );
  const [expandYearDataType, setExpandYearDataType] = useState<string>("");
  const [expandMonthDataType, setExpandMonthDataType] = useState<string>("");

  const activeYearRef = useRef<YearFormType | undefined>(undefined);
  const activeMonthRef = useRef<MonthFormType | undefined>(undefined);

  useEffect(() => {
    const years = document.querySelectorAll<HTMLElement>(
      `[data-year-body="${formData.id}"]`
    );

    const onScroll = () => {
      const { newActiveYear, activeYearBodyEl } = onScrollYearHelper(
        formData,
        years,
        setExpandYearDataType
      );
      onScrollSetter(newActiveYear, activeYearRef, setActiveYear);

      if (activeYearBodyEl && newActiveYear) {
        const months = activeYearBodyEl.querySelectorAll<HTMLElement>(
          `[data-month-body="${newActiveYear.id}"]`
        );
        const { newActiveMonth } = onScrollMonthHelper(
          months,
          newActiveYear,
          setExpandMonthDataType
        );
        onScrollSetter(newActiveMonth, activeMonthRef, setActiveMonth);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [formData]);

  useEffect(() => {
    activeYearRef.current = activeYear;
  }, [activeYear]);

  useEffect(() => {
    activeMonthRef.current = activeMonth;
  }, [activeMonth]);

  return (
    <div className="w-full">
      {activeYear && (
        <AccordionStickyHeader
          isMonth={false}
          labelMain={activeYear.id.toString()}
          budget={activeYear?.budget ?? 0}
          costs={activeYear?.costs ?? 0}
          balance={activeYear?.balance ?? 0}
          expandDataType={expandYearDataType}
          expandDisabled={false}
        />
      )}
      {activeMonth && (
        <AccordionStickyHeader
          isMonth={true}
          labelMain={t(locale, `body.form.valueMonth.${activeMonth.title}`)}
          budget={activeMonth?.budget ?? 0}
          costs={activeMonth?.costsAmount ?? 0}
          balance={activeMonth?.balance ?? 0}
          expandDataType={expandMonthDataType}
          expandDisabled={activeMonth?.costs?.length === 0}
        />
      )}
      {formData.years.map((year, index) => (
        <AccordionYearBlock formDataId={formData.id} key={index} year={year} />
      ))}
    </div>
  );
};

export default AccordionBlock;
