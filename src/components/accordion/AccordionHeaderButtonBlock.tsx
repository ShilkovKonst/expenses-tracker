"use client";
import { useGlobal } from "@/app/context/GlobalContext";
import { AddBudget, AddCost, ExpandIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import CostButton from "../CostButton";
import { transformElement } from "@/lib/utils/transformElement";
import { MouseEvent as RMouseEvent } from "react";

type AccordionHeaderButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  expandButtonSize: string;
  expandDataType: string;
  expandDisabled?: boolean;
  isMonth?: boolean;
  handleAddCost?: (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const AccordionHeaderButtonBlock: React.FC<AccordionHeaderButtonBlockProps> = ({
  outerStyle,
  iconSize,
  buttonSize,
  isMonth,
  expandButtonSize,
  expandDataType,
  expandDisabled,
  handleAddCost,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${outerStyle} pr-2 gap-2 flex flex-row justify-end items-center`}
    >
      <div className={isMonth ? "flex gap-2 justify-between items-center" : ""}>
        <CostButton
          icon={<AddBudget style={iconSize} />}
          title={t(locale, `body.form.accordionAddBudget`)}
          style={`bg-blue-500 hover:bg-blue-400 ${buttonSize}`}
          handleClick={() => {}}
        />
        {isMonth && (
          <CostButton
            icon={<AddCost style={iconSize} />}
            title={t(locale, `body.form.accordionAddCost`)}
            style={`bg-blue-500 hover:bg-blue-400 ${buttonSize}`}
            handleClick={handleAddCost ? (e) => handleAddCost(e) : () => {}}
          />
        )}
      </div>
      <CostButton
        icon={<ExpandIcon style={iconSize} />}
        dataType={expandDataType}
        title={t(locale, `body.form.accordionExpandCosts`)}
        style={`bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 ${expandButtonSize}`}
        handleClick={(e) =>
          transformElement(e.target as HTMLElement, "data-type")
        }
        disabled={expandDisabled}
      />
    </div>
  );
};

export default AccordionHeaderButtonBlock;
