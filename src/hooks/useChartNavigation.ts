"use client";
import { useCallback, useEffect, useState } from "react";
import {
  createMonthId,
  createYearId,
  MonthId,
  YearId,
  TrackerId,
} from "@/lib/types/brand";

export function useChartNavigation(trackerId: TrackerId) {
  const [selectedYearId, setSelectedYearId] = useState<YearId>(
    createYearId(-1),
  );
  const [selectedMonthId, setSelectedMonthId] = useState<MonthId>(
    createMonthId(-1),
  );

  useEffect(() => {
    setSelectedYearId(createYearId(-1));
    setSelectedMonthId(createMonthId(-1));
  }, [trackerId]);

  const handleClick = useCallback(
    (id: number) => {
      if (selectedYearId !== -1 && selectedMonthId === -1)
        setSelectedMonthId(createMonthId(id));
      if (selectedYearId === -1) setSelectedYearId(createYearId(id));
    },
    [selectedYearId, selectedMonthId],
  );

  const handleUndo = useCallback(() => {
    if (selectedMonthId !== -1) setSelectedMonthId(createMonthId(-1));
    else setSelectedYearId(createYearId(-1));
  }, [selectedMonthId]);

  return { selectedYearId, selectedMonthId, handleClick, handleUndo };
}
