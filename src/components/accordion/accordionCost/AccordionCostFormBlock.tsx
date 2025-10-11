/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { CostFormType } from "@/types/formTypes";
import FormInputBlock from "../../FormInputBlock";
import TagButton from "../../TagButton";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import {
  Dispatch,
  MouseEvent as RMouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isEqual } from "@/lib/utils/equalizer";

type AccordionCostFormBlockProps = {
  currentCost: CostFormType;
  setCurrentCost: Dispatch<SetStateAction<CostFormType>>;
  formId: string;
  handleUpdate: (
    e: RMouseEvent<HTMLButtonElement, MouseEvent>,
    isDelete: boolean
  ) => void;
};

const AccordionCostFormBlock: React.FC<AccordionCostFormBlockProps> = ({
  currentCost,
  setCurrentCost,
  formId,
  handleUpdate,
}) => {
  const { locale } = useGlobal();
  const [oldCost, setOldCost] = useState<CostFormType | undefined>(undefined);
  const [undoDisabled, setUndoDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!currentCost) return;
    if (!oldCost) setOldCost(currentCost);
  }, [currentCost]);

  useEffect(() => {
    setUndoDisabled(isEqual(currentCost, oldCost));
  }, [oldCost, currentCost]);

  const handleCostChange = <K extends keyof CostFormType>(
    field: K,
    value: CostFormType[K]
  ) => {
    if (!currentCost) return;
    setCurrentCost((cost) => ({
      ...cost,
      [field]:
        typeof value === "string" && field === "amount"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleClear = (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (oldCost) setCurrentCost(oldCost);
  };

  const formFields = [
    {
      name: "type",
      title: t(locale, `body.form.costType`),
      id: "costTypeInput" + currentCost.id,
      value: currentCost.type,
      type: "text",
    },
    {
      name: "amount",
      title: t(locale, `body.form.costAmount`),
      id: "costAmountInput" + currentCost.id,
      value: currentCost.amount,
      type: "number",
    },
    {
      name: "description",
      title: t(locale, `body.form.costDescription`),
      id: "costDescInput" + currentCost.id,
      value: currentCost.description,
      type: "text",
    },
  ];
  return (
    <form
      id={formId}
      style={{ height: 0 }}
      className="pl-2 col-span-6 grid grid-cols-2 md:grid-cols-6 gap-2 items-end transition-[height] duration-300 ease-in-out overflow-hidden "
    >
      {formFields.map((c, i) => (
        <FormInputBlock
          key={i}
          name={c.name}
          title={c.title}
          id={c.id}
          value={c.value}
          handleChange={(e) =>
            handleCostChange(c.name as keyof CostFormType, e.target.value)
          }
          type={c.type as "number" | "text"}
          disabled={false}
          required={true}
          styleLabel={"text-xs"}
          styleInput={"px-2 py-1 text-sm"}
        />
      ))}
      <TagButton
        title="&#10004;"
        style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1"
        handleClick={(e) => handleUpdate(e, false)}
      />
      <TagButton
        title="&#10006;"
        style="bg-red-300 hover:bg-red-400 border-red-400 cols-span-1 disabled:text-gray-600 disabled:bg-red-200 disabled:hover:bg-red-200 disabled:border-red-300"
        handleClick={(e) => handleClear(e)}
        disabled={undoDisabled}
      />
      <div className="col-span-2 md:col-span-6"></div>
    </form>
  );
};

export default AccordionCostFormBlock;
