/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useState,
} from "react";
import { DataType } from "@/types/formTypes";
import { transformElement } from "@/lib/utils/transformElement";
import { AddTag } from "@/lib/icons";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import FormSelectBlock from "./formComponents/FormSelectBlock";
import TagButton from "./buttonComponents/TagButton";
import CostButton from "./buttonComponents/CostButton";

const DataTypesBlock: React.FC = () => {
  const { locale, selectedType, setSelectedType } = useGlobal();
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [customType, setCustomType] = useState<DataType>({
    id: 0,
    title: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);

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

  const handleCustomTagChange = (custom: string) => {
    setCustomType({ ...customType, title: custom.trim() });
    if (dataTypes.some((t) => t.title === custom)) {
      setIsDisabled(true);
    } else if (isDisabled) {
      setIsDisabled(false);
    }
  };

  const handleCustomTagAdd = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customType) {
      const newTags = [...dataTypes, customType];
      localStorage.setItem("dataTypes", JSON.stringify(newTags));
      setDataTypes(newTags);
      setCustomType({ id: newTags.length, title: "" });
    }
  };

  const handleCustomTagRemove = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customType) {
      if (dataTypes.find((t) => t.title === customType.title.trim())) {
        const newTypes = [...dataTypes.filter((t) => t !== customType)];
        localStorage.setItem("dataTypes", JSON.stringify(newTypes));
        setDataTypes(newTypes);
        setCustomType({ id: newTypes.length, title: "" });
      } else {
        setCustomType({ ...customType, title: "" });
      }
    }
  };

  const handleSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const tag = dataTypes.find((t) => t.title === e.target.value);
    if (tag) setSelectedType(tag);
  };

  return (
    <div>
      <h3 className="text-sm my-2">
        {t(locale, `body.form.data.typeFormTitle`)}
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 justify-between items-center">
        {dataTypes && (
          <FormSelectBlock
            id="tagSelect"
            style="px-2 py-2 text-sm"
            value={selectedType.title}
            options={dataTypes.map((t) => t.title)}
            onChange={(e) => handleSelectTag(e)}
          />
        )}
        <CostButton
          icon={<AddTag style="h-7 w-7" />}
          dataType="form-custom-tag"
          dataUpdate=""
          title={t(locale, `body.form.data.typeTitle`)}
          style="bg-blue-400 hover:bg-blue-500 col-span-2 md:col-span-1 h-9 w-9"
          handleClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
        />
        <div className="col-span-6 border-b-2 border-blue-100 mt-2" />
        <form
          style={{ height: 0 }}
          id="form-custom-tag"
          className="w-full gap-3 col-span-4 md:col-span-3 overflow-hidden transition-[height] duration-300 ease-in-out grid grid-cols-4"
        >
          <div className="w-full col-span-4 grid grid-cols-2 gap-2">
            <input
              className="w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-sm"
              placeholder={t(locale, `body.form.data.typeCustomTitle`)}
              type="text"
              value={customType.title}
              onChange={(e) => handleCustomTagChange(e.target.value)}
            />
            {isDisabled && (
              <p className="text-xs text-red-600 my-auto">
                {t(locale, `body.form.data.typeDouble`)}
              </p>
            )}
          </div>
          <TagButton
            title="&#10004;"
            style={`border-green-300 col-span-2 ${
              isDisabled
                ? "bg-green-100 text-gray-500"
                : "bg-green-200 hover:bg-green-300 cursor-pointer"
            }`}
            handleClick={handleCustomTagAdd}
            disabled={isDisabled}
          />
          <TagButton
            title="&#10006;"
            style="bg-red-200 hover:bg-red-300 border-red-300 col-span-2"
            handleClick={handleCustomTagRemove}
          />
        </form>
        <div className="col-span-6 border-t-2 border-blue-100 mb-2" />
      </div>
    </div>
  );
};

export default DataTypesBlock;
