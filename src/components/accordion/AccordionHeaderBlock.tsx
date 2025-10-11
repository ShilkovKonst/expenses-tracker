import { MouseEvent as RMouseEvent } from "react";
import AccordionDescriptionBlock from "./AccordionDescriptionBlock";
import AccordionHeaderButtonBlock from "./AccordionHeaderButtonBlock";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  expandDataType: string;
  expandDisabled: boolean;
  isMonth?: boolean;
  dataId?: string;
  dataHeader?: string;
  handleAddCost?: (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const AccordionHeaderBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
  expandDataType,
  expandDisabled,
  isMonth,
  dataId,
  dataHeader,
  handleAddCost,
}) => {
  return (
    <div
      id={dataId}
      data-month-id={dataId}
      data-month-header={dataHeader}
      className={`header col-span-6 grid grid-cols-6 gap-3 w-full border-2 ${
        isMonth ? "bg-blue-100 border-blue-200" : "bg-blue-200 border-blue-300"
      }`}
    >
      <AccordionDescriptionBlock
        labelMain={`${labelMain}`}
        budget={budget}
        costs={costs}
        balance={balance}
        isMonth={isMonth}
      />
      <AccordionHeaderButtonBlock
        outerStyle="col-span-2"
        iconSize="h-4 w-4"
        buttonSize="h-6 w-8"
        expandButtonSize="h-6 w-6"
        isMonth={isMonth}
        expandDataType={expandDataType}
        expandDisabled={expandDisabled}
        handleAddCost={handleAddCost}
      />
    </div>
  );
};

export default AccordionHeaderBlock;
