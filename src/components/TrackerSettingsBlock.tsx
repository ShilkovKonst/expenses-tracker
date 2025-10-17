"use client"
import { useGlobal } from "@/context/GlobalContext"
import DataTypesBlock from "./DataTypesBlock"
import PersonnalisationBlock from "./PersonnalisationBlock"
import { ChangeEvent, useEffect, useState } from "react"
import { DataType } from "@/types/formTypes"


const TrackerSettingsBlock = () => {
  const { selectedType, setSelectedType } = useGlobal();

  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [customType, setCustomType] = useState<DataType>({
    id: 0,
    title: "",
  });

  useEffect(() => {
    if (localStorage) {
      const rawTypes = localStorage.getItem("dataTypes");
      if (!rawTypes)
        localStorage.setItem("dataTypes", JSON.stringify([selectedType]));
      const types: DataType[] = rawTypes
        ? JSON.parse(rawTypes)
        : [selectedType];
      setDataTypes(types);
    }
  }, []);

  useEffect(() => {
    if (customType.id === 0)
      setCustomType({ ...customType, id: dataTypes.length });
  }, [dataTypes]);

  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = dataTypes.find((t) => t.title === e.target.value);
    if (type) setSelectedType(type);
  };

  return (
    <div className="grid grico1 md:grid-cols-2 gap-2 border-b-6 border-blue-400 pb-2">
      <DataTypesBlock
        dataTypes={dataTypes}
        handleSelectType={handleSelectType} />
      <PersonnalisationBlock
        dataTypes={dataTypes}
        setDataTypes={setDataTypes}
        customType={customType}
        setCustomType={setCustomType} />
    </div>

  )
}

export default TrackerSettingsBlock