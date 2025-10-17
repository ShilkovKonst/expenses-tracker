/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { DataType } from "@/types/formTypes";
import { transformElement } from "@/lib/utils/transformElement";
import { AddTag } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import FormSelectBlock from "./formComponents/FormSelectBlock";
import TagButton from "./buttonComponents/TagButton";
import CostButton from "./buttonComponents/CostButton";

type DataTypesProps = {
  dataTypes: DataType[]
  handleSelectType: (e: ChangeEvent<HTMLSelectElement>) => void
}

const DataTypesBlock: React.FC<DataTypesProps> = ({ dataTypes, handleSelectType }) => {
  const { locale, selectedType } = useGlobal();

  return (
    <div>
      <h3 className="text-sm my-2">
        {t(locale, `body.form.data.typeSelect`)}
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 justify-between items-center">
        {dataTypes && (
          <FormSelectBlock
            id="tagSelect"
            style="px-2 py-2 text-sm"
            value={selectedType.title}
            options={dataTypes.map((t) => t.title)}
            onChange={(e) => handleSelectType(e)}
          />
        )}
      </div>
    </div>
  );
};

export default DataTypesBlock;
