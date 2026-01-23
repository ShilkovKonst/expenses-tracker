"use client";
import { Month, Year } from "@/lib/types/dataTypes";
import {
  onScrollMonthHelper,
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
        `[data-year-body="${trackerId}"]`,
      );

      const onScroll = () => {
        const { newActiveYear, activeYearBodyEl } = onScrollYearHelper(
          years,
          setExpandYearDataType,
        );
        if (newActiveYear) {
          if (activeYearRef.current?.id !== newActiveYear) {
            setActiveYear(trackerYears[newActiveYear]);
          }
        } else {
          if (activeYearRef.current !== undefined) {
            setActiveYear(undefined);
          }
        }

        if (activeYearBodyEl && newActiveYear) {
          const months = activeYearBodyEl.querySelectorAll<HTMLElement>(
            `[data-month-body="${newActiveYear}"]`,
          );
          const { newActiveMonth } = onScrollMonthHelper(
            months,
            newActiveYear,
            setExpandMonthDataType,
          );
          if (newActiveMonth) {
            if (activeMonthRef.current?.id !== newActiveMonth) {
              setActiveMonth(
                trackerYears[newActiveYear].months[newActiveMonth],
              );
            }
          } else {
            if (activeMonthRef.current !== undefined) {
              setActiveMonth(undefined);
            }
          }
        }
      };

      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [trackerId, trackerYears]);

  useEffect(() => {
    if (trackerYears) {
      if (activeYear) {
        setActiveYear(trackerYears[activeYear?.id]);
      }
      if (activeYear && activeMonth) {
        setActiveMonth(trackerYears[activeYear?.id].months[activeMonth?.id]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackerYears]);

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
          yearId={activeYear.id}
          labelMain={activeYear.id.toString()}
          totalAmount={decimalToInputString(locale, activeYear.totalAmount)}
          expandDataType={expandYearDataType}
          expandDisabled={false}
        />
      )}
      {activeYear && activeMonth && (
        <StickyHeader
          isMonth={true}
          labelMain={t(locale, `body.form.valueMonth.${activeMonth.title}`)}
          totalAmount={decimalToInputString(locale, activeMonth.totalAmount)}
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
