import FormInputBlock from "./FormInputBlock";
import CostButton from "./CostButton";
import { CostFormType } from "@/types/formTypes";
import { Locale, t } from "@/locales/locale";
import { Dispatch, SetStateAction, useMemo } from "react";

type FormCostsBlockPropsType = {
  locale: Locale;
  costs: CostFormType[];
  setCosts: Dispatch<SetStateAction<CostFormType[]>>;
  inputStyles: string[];
};

const FormCostsBlock: React.FC<FormCostsBlockPropsType> = ({
  locale,
  costs,
  setCosts,
  inputStyles,
}) => {
  const monthCosts = useMemo(
    () => Math.floor(costs.reduce((acc, c) => acc + c.amount, 0) * 100) / 100,
    [costs]
  );

  const handleAddCost = () => {
    setCosts([...costs, { title: "", type: "", amount: 0 }]);
  };

  const handleRemoveCost = (i: number) => {
    setCosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
  };

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
    <div className="mt-6">
      <h3 className="font-semibold text-blue-900">
        {t(locale, `body.form.costs`)}
      </h3>

      {costs.map((cost, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 items-end py-2 border-b border-blue-300"
        >
          {[
            {
              name: "title",
              title: t(locale, `body.form.costType`),
              id: "costTitleInput" + index,
              value: cost.title,
              handleChange: handleCostChange,
              type: "text",
            },
            {
              name: "type",
              title: t(locale, `body.form.costDescription`),
              id: "costTypeInput" + index,
              value: cost.type,
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
              styleLabel={inputStyles[0]}
              styleInput={inputStyles[1]}
            />
          ))}
          <CostButton
            dataType=""
            dataUpdate=""
            title={t(locale, `body.form.costRemove`)}
            style="bg-red-200 hover:bg-red-300"
            handleClick={() => handleRemoveCost(index)}
          />
        </div>
      ))}
      <div className="flex gap-4 justify-between items-center">
        <CostButton
          dataType=""
          dataUpdate=""
          title={t(locale, `body.form.costAdd`)}
          style="bg-blue-200 hover:bg-blue-300"
          handleClick={handleAddCost}
        />
        <div>
          <p>Monthly costs: {monthCosts}</p>
        </div>
      </div>
    </div>
  );
};

export default FormCostsBlock;
