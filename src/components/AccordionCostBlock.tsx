import React, { Dispatch, SetStateAction } from "react";
import FormInputBlock from "./FormInputBlock";
import { CostFormType, MonthFormType, YearFormType } from "@/types/formTypes";
import CostButton from "./CostButton";
import { Locale, t } from "@/locales/locale";
import TagButton from "./TagButton";
import { Delete, Update } from "@/lib/icons";
import AccordionCostDescriptionBlock from "./AccordionCostDescriptionBlock";

type AccordionCostBlockPropsType = {
  locale: Locale;
  index: number;
  year: [string, YearFormType];
  month: [string, MonthFormType];
  cost: CostFormType;
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
};

const AccordionCostBlock: React.FC<AccordionCostBlockPropsType> = ({
  locale,
  index,
  year,
  month,
  cost,
  costs,
  setCosts,
}) => {
  const handleCostChange = (
    index: number,
    field: keyof CostFormType,
    value: string
  ) => {
    const newCosts = [...costs];
    if (field === "amount" && Number(value) >= 0) {
      value = value.replace(/^0+(?=\d)/, "");
      newCosts[index][field] = Number(value);
    }
    if (field !== "amount") {
      newCosts[index][field] = value;
    }
    setCosts(newCosts);
  };

  return (
    <div key={index} className="cost grid grid-cols-6 gap-2 w-full">
      <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <AccordionCostDescriptionBlock
          labelCostType={`${t(locale, `body.form.costType`)}`}
          labelCostDescription={`${t(locale, `body.form.costDescription`)}: `}
          labelCostAmount={`${t(locale, `body.form.costAmount`)}: `}
          costType={cost.type}
          costDescription={cost.description}
          costAmount={cost.amount}
        />
        <div className="col-span-2 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
          <CostButton
            icon={<Update style="h-7 w-7" />}
            dataType={`update`}
            dataUpdate={`${year[0]}-${month[0]}-${
              cost.type
            }-${cost.description?.slice(0, 3)}-${cost.amount}`}
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
        id={`${year[0]}-${month[0]}-${cost.type}-${cost.description?.slice(
          0,
          3
        )}-${cost.amount}`}
        style={{ height: 0 }}
        className="col-span-2 md:col-span-6 grid grid-cols-2 md:grid-cols-8 gap-2 md:gap-4 items-end transition-[height] duration-300 ease-in-out overflow-hidden "
      >
        {[
          {
            name: "type",
            title: t(locale, `body.form.costType`),
            id: "costTypeInput" + index,
            value: cost.type,
            handleChange: handleCostChange,
            type: "text",
          },
          {
            name: "description",
            title: t(locale, `body.form.costDescription`),
            id: "costDescInput" + index,
            value: cost.description,
            handleChange: handleCostChange,
            type: "text",
          },
          {
            name: "amount",
            title: t(locale, `body.form.costAmount`),
            id: "costAmountInput" + index,
            value: cost.amount,
            handleChange: handleCostChange,
            type: "number",
          },
        ].map((c, i) => (
          <FormInputBlock
            key={i}
            title={c.title}
            id={c.id}
            value={c.value}
            handleChange={(e) =>
              c.handleChange(
                index,
                c.name as keyof CostFormType,
                e.target.value
              )
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
      </form>
    </div>
  );
};

export default AccordionCostBlock;
