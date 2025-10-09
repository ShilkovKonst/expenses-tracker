"use client";
import React, { Dispatch, SetStateAction } from "react";
import FormInputBlock from "./FormInputBlock";
import { CostFormType } from "@/types/formTypes";
import CostButton from "./CostButton";
import { t } from "@/locales/locale";
import TagButton from "./TagButton";
import { Delete, Update } from "@/lib/icons";
import AccordionCostDescriptionBlock from "./AccordionCostDescriptionBlock";
import { useGlobal } from "@/app/context/GlobalContext";

type AccordionCostBlockPropsType = {
  yearMonthId: string;
  cost: CostFormType;
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionCostBlock: React.FC<AccordionCostBlockPropsType> = ({
  yearMonthId,
  cost,
  costs,
  setCosts,
}) => {
  const { locale } = useGlobal();

  const handleCostChange = <K extends keyof CostFormType>(
    field: K,
    value: CostFormType[K]
  ) => {
    const newCosts = [...costs];
    const costIndex = newCosts.findIndex((c) => c.id === cost.id);
    if (costIndex === -1) return;

    newCosts[costIndex][field] = value;
    setCosts(newCosts);
  };

  return (
    <div className="cost grid grid-cols-6 gap-2 w-full">
      <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <AccordionCostDescriptionBlock
          labelCostType={`${t(locale, `body.form.costType`)}`}
          labelCostDescription={`${t(locale, `body.form.costDescription`)}: `}
          labelCostAmount={`${t(locale, `body.form.costAmount`)}: `}
          costType={cost.type}
          costDescription={cost.description}
          costAmount={cost.amount}
        />
        <div className="col-span-1 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
          <CostButton
            icon={<Update style="h-7 w-7" />}
            dataType={`update`}
            dataUpdate={`${yearMonthId}-${cost.id}-${cost.type}-${cost.amount}`}
            title={t(locale, `body.form.accordionUpdateCost`)}
            style="bg-blue-300 hover:bg-blue-400 h-11 w-11"
            handleClick={() => {}}
          />
          <CostButton
            icon={<Delete style="h-7 w-7" />}
            dataType={``}
            dataUpdate={``}
            title={t(locale, `body.form.accordionRemoveCost`)}
            style="bg-red-300 hover:bg-red-400 h-11 w-11"
            handleClick={() => {}}
          />
        </div>
      </div>
      <form
        id={`${yearMonthId}-${cost.id}-${cost.type}-${cost.amount}`}
        style={{ height: 0 }}
        className="col-span-6 grid grid-cols-2 md:grid-cols-6 gap-2 items-end transition-[height] duration-300 ease-in-out overflow-hidden "
      >
        {[
          {
            name: "type",
            title: t(locale, `body.form.costType`),
            id: "costTypeInput" + cost.id,
            value: cost.type,
            handleChange: handleCostChange,
            type: "text",
          },
          {
            name: "amount",
            title: t(locale, `body.form.costAmount`),
            id: "costAmountInput" + cost.id,
            value: cost.amount,
            handleChange: handleCostChange,
            type: "number",
          },
          {
            name: "description",
            title: t(locale, `body.form.costDescription`),
            id: "costDescInput" + cost.id,
            value: cost.description,
            handleChange: handleCostChange,
            type: "text",
          },
        ].map((c, i) => (
          <FormInputBlock
            key={i}
            name={c.name}
            title={c.title}
            id={c.id}
            value={c.value}
            handleChange={(e) =>
              c.handleChange(c.name as keyof CostFormType, e.target.value)
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
          style="bg-green-200 hover:bg-green-300 border-green-300 cols-span-1"
          handleClick={() => {}}
        />
        <TagButton
          title="&#10006;"
          style="bg-red-200 hover:bg-red-300 border-red-300 cols-span-1"
          handleClick={() => {}}
        />
        <div className="col-span-2 md:col-span-6"></div>
      </form>
    </div>
  );
};

export default AccordionCostBlock;
