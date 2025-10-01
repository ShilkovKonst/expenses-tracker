import React, { Dispatch, SetStateAction } from "react";
import FormInputBlock from "./FormInputBlock";
import { CostFormType, MonthFormType, YearFormType } from "@/types/formTypes";
import CostButton from "./CostButton";
import { Locale, t } from "@/locales/locale";
import TagButton from "./TagButton";

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
    <div
      key={index}
      className="cost my-1 gap-3 p-2 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100 grid grid-cols-6"
    >
      <p className="w-full col-span-4">
        <span className="font-bold capitalize">title</span> - {cost.title}{" "}
        <span className="font-bold">type</span> - {cost.type}{" "}
        <span className="font-bold">amount</span> - {cost.amount}
      </p>
      <CostButton
        dataType={`update`}
        dataUpdate={`${year[0]}-${month[0]}-${cost.title}-${cost.type}-${cost.amount}`}
        title={t(locale, `body.form.accordionUpdateCost`)}
        style="bg-blue-300 hover:bg-blue-400 col-span-1"
        handleClick={() => {}}
      />
      <CostButton
        dataType={``}
        dataUpdate={``}
        title={t(locale, `body.form.accordionRemoveCost`)}
        style="bg-red-300 hover:bg-red-400 col-span-1"
        handleClick={() => {}}
      />
      <form
        id={`${year[0]}-${month[0]}-${cost.title}-${cost.type}-${cost.amount}`}
        style={{ height: 0 }}
        className="col-span-6 grid grid-cols-8 gap-4 items-end transition-[height] duration-300 ease-in-out overflow-hidden "
      >
        {[
          {
            name: "title",
            title: t(locale, `body.form.expensesTitle`),
            id: "costTitleInput" + index,
            value: cost.title,
            handleChange: handleCostChange,
            type: "text",
          },
          {
            name: "type",
            title: t(locale, `body.form.expensesType`),
            id: "costTypeInput" + index,
            value: cost.type,
            handleChange: handleCostChange,
            type: "text",
          },
          {
            name: "amount",
            title: t(locale, `body.form.expensesAmount`),
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
