"use client";
import { Month, Year } from "@/types/formTypes";
import { useEffect, useRef, useState } from "react";
import YearBlock from "./YearBlock";
import StickyHeader from "./StickyHeader";
import { t } from "@/locales/locale";
import { useGlobal } from "@/app/context/GlobalContext";
import {
  onScrollMonthHelper,
  onScrollSetter,
  onScrollYearHelper,
} from "@/lib/utils/onScrollHelper";

const AccordionBlock: React.FC = () => {
  const { locale, data } = useGlobal();
  const [activeMonth, setActiveMonth] = useState<Month | undefined>(undefined);
  const [activeYear, setActiveYear] = useState<Year | undefined>(undefined);
  const [expandYearDataType, setExpandYearDataType] = useState<string>("");
  const [expandMonthDataType, setExpandMonthDataType] = useState<string>("");

  const activeYearRef = useRef<Year | undefined>(undefined);
  const activeMonthRef = useRef<Month | undefined>(undefined);

  useEffect(() => {
    const years = document.querySelectorAll<HTMLElement>(
      `[data-year-body="${data.id}"]`
    );

    const onScroll = () => {
      const { newActiveYear, activeYearBodyEl } = onScrollYearHelper(
        data,
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
  }, [data]);

  useEffect(() => {
    activeYearRef.current = activeYear;
  }, [activeYear]);

  useEffect(() => {
    activeMonthRef.current = activeMonth;
  }, [activeMonth]);

  return (
    <div className="w-full">
      {activeYear && (
        <StickyHeader
          isMonth={false}
          labelMain={activeYear.id.toString()}
          totalAmount={activeYear?.totalAmount ?? 0}
          expandDataType={expandYearDataType}
          expandDisabled={false}
        />
      )}
      {activeMonth && (
        <StickyHeader
          isMonth={true}
          labelMain={t(locale, `body.form.valueMonth.${activeMonth.title}`)}
          totalAmount={activeMonth?.totalAmount ?? 0}
          expandDataType={expandMonthDataType}
          expandDisabled={activeMonth?.operations?.length === 0}
        />
      )}
      {data.years.map((year, index) => (
        <YearBlock dataId={data.id} key={index} year={year} />
      ))}
    </div>
  );
};

export default AccordionBlock;
