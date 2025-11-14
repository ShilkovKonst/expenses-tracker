import { Month, MonthIdType, Year } from "@/types/formTypes";
import { Dispatch, RefObject, SetStateAction } from "react";

type OnScrollYearHelperOutput = {
  newActiveYear: Year | undefined;
  activeYearBodyEl: HTMLElement | undefined;
};

export function onScrollYearHelper(
  years: Year[],
  yearNodes: NodeListOf<HTMLElement>,
  setExpandYearDataType: Dispatch<SetStateAction<string>>
): OnScrollYearHelperOutput {
  for (const yearBodyEl of yearNodes) {
    const yearId = yearBodyEl.getAttribute("data-year-id");

    if (!yearId) {
      throw new Error("Year element is missing id attribute");
    }

    const year = years.find((y) => y.id === parseInt(yearId));
    if (!year) {
      throw new Error(`Year with id ${yearId} not found in formData`);
    }

    const yearHeaderEl = yearBodyEl?.getElementsByClassName("header")[0];
    if (!yearBodyEl || !yearHeaderEl) {
      throw new Error(`Year body is missing or has no header`);
    }

    const rectYearBody = yearBodyEl.getBoundingClientRect();
    const rectYearhHeader = yearHeaderEl.getBoundingClientRect();
    const yearBodyTrigger = rectYearBody.top + rectYearBody.height;
    const yearHeaderTrigger = rectYearhHeader.top + rectYearhHeader.height;

    if (yearHeaderTrigger <= 0 && yearBodyTrigger > 10) {
      setExpandYearDataType(`${yearId}`);
      return { newActiveYear: year, activeYearBodyEl: yearBodyEl };
    }
  }
  return { newActiveYear: undefined, activeYearBodyEl: undefined };
}

type OnScrollMonthHelperOutput = { newActiveMonth: Month | undefined };
export function onScrollMonthHelper(
  months: NodeListOf<HTMLElement>,
  newActiveYear: Year,
  setExpandMonthDataType: Dispatch<SetStateAction<string>>
): OnScrollMonthHelperOutput {
  for (const monthBodyEl of months) {
    const monthHeaderEl = monthBodyEl?.getElementsByClassName("header")[0];
    if (!monthBodyEl || !monthHeaderEl) {
      throw new Error(
        `Month body ${newActiveYear.id} is missing or has no header`
      );
    }

    const rectMonthBody = monthBodyEl.getBoundingClientRect();
    const rectMonthHeader = monthHeaderEl.getBoundingClientRect();
    const monthBodyTrigger = rectMonthBody.top + rectMonthBody.height;
    const monthHeaderTrigger = rectMonthHeader.top + rectMonthHeader.height;

    if (monthHeaderTrigger <= 0 && monthBodyTrigger > 10) {
      const dataMonth = monthBodyEl.getAttribute("data-month-id");
      if (dataMonth) {
        const monthId = parseInt(dataMonth) as MonthIdType;
        setExpandMonthDataType(`${newActiveYear.id}-${monthId}`);
        return { newActiveMonth: newActiveYear.months[monthId - 1] };
      }
    }
  }
  return { newActiveMonth: undefined };
}

export function onScrollSetter<T extends Year | Month>(
  newActive: T | undefined,
  activeRef: RefObject<T | undefined>,
  setActive: Dispatch<SetStateAction<T | undefined>>
) {
  if (newActive) {
    if (activeRef.current?.id !== newActive.id) {
      setActive(newActive);
    }
  } else {
    if (activeRef.current !== undefined) {
      setActive(undefined);
    }
  }
}
