/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import DataTypesBlock from "./DataTypesBlock";
import { useEffect, useState } from "react";
import { TrackerType } from "@/types/formTypes";

const TrackerBlock = () => {
  const { selectedType, setSelectedType, trackerTypes, setTrackerTypes } =
    useGlobal();

  const [customType, setCustomType] = useState<TrackerType>({
    id: -1,
    title: "",
  });

  useEffect(() => {
    if (localStorage) {
      const rawTypes = localStorage.getItem("trackerTypes");
      if (!rawTypes)
        localStorage.setItem("trackerTypes", JSON.stringify([selectedType]));
      const types: TrackerType[] = rawTypes
        ? JSON.parse(rawTypes)
        : [selectedType];
      setTrackerTypes(types);
    }
  }, []);

  useEffect(() => {
    if (customType.id === -1)
      setCustomType({ ...customType, id: trackerTypes.length });
  }, [trackerTypes]);

  const handleSelectType = (t: TrackerType) => {
    const type = trackerTypes.find((tp) => tp.title === t.title);
    if (type) setSelectedType(t);
  };

  return (
    <div className="grid grid-cols-1 gap-2 border-b-6 border-blue-400 pb-2">
      <DataTypesBlock
        trackerTypes={trackerTypes}
        handleSelectType={handleSelectType}
      />
    </div>
  );
};

export default TrackerBlock;
