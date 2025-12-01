"use client";
import { Month, Year } from "@/lib/types/dataTypes";
import {
  onScrollMonthHelper,
  onScrollSetter,
  onScrollYearHelper,
} from "@/lib/utils/onScrollHelper";
import React, { useEffect, useRef, useState } from "react";
import StickyHeader from "./StickyHeader";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { t } from "@/locales/locale";
import { decimalToInputString } from "@/lib/utils/amountHelper";

const StickyBlock = () => {
  const { locale } = useGlobal();
  const { trackerId, trackerYears } = useTracker();

  const [activeMonth, setActiveMonth] = useState<Month | undefined>(undefined);
  const [activeYear, setActiveYear] = useState<Year | undefined>(undefined);
  const [expandYearDataType, setExpandYearDataType] = useState<string>("");
  const [expandMonthDataType, setExpandMonthDataType] = useState<string>("");

  const activeYearRef = useRef<Year | undefined>(undefined);
  const activeMonthRef = useRef<Month | undefined>(undefined);

  useEffect(() => {
    if (trackerYears) {
      const years = document.querySelectorAll<HTMLElement>(
        `[data-year-body="${trackerId}"]`
      );

      const onScroll = () => {
        const { newActiveYear, activeYearBodyEl } = onScrollYearHelper(
          trackerYears,
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
    }
  }, [trackerId, trackerYears]);

  useEffect(() => {
    activeYearRef.current = activeYear;
  }, [activeYear]);

  useEffect(() => {
    activeMonthRef.current = activeMonth;
  }, [activeMonth]);

  return (
    <>
      {activeYear && (
        <StickyHeader
          isMonth={false}
          labelMain={activeYear.id.toString()}
          totalAmount={decimalToInputString(activeYear.totalAmount)}
          expandDataType={expandYearDataType}
          expandDisabled={false}
        />
      )}
      {activeYear && activeMonth && (
        <StickyHeader
          isMonth={true}
          labelMain={t(locale, `body.form.valueMonth.${activeMonth.title}`)}
          totalAmount={decimalToInputString(activeMonth.totalAmount)}
          expandDataType={expandMonthDataType}
          expandDisabled={activeMonth.records?.length === 0}
          yearId={activeYear.id}
          monthId={activeMonth.id}
          recordsLength={activeMonth.records?.length}
        />
      )}
    </>
  );
};

export default StickyBlock;
