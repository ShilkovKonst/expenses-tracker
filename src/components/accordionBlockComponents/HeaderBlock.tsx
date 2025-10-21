import DescriptionBlock from "./DescriptionBlock";
import HeaderButtonBlock from "./HeaderButtonBlock";

type DescriptionPropsType = {
  labelMain: string;
  totalAmount: number;
  expandDataType: string;
  expandDisabled: boolean;
  isMonth?: boolean;
  dataId?: string;
  dataHeader?: string;
  handleAddOperation?: () => void;
};

const HeaderBlock: React.FC<DescriptionPropsType> = ({
  labelMain,
  totalAmount,
  expandDataType,
  expandDisabled,
  isMonth,
  dataId,
  dataHeader,
  handleAddOperation,
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
      <DescriptionBlock
        labelMain={`${labelMain}`}
        totalAmount={totalAmount}
        isMonth={isMonth}
      />
      <HeaderButtonBlock
        outerStyle="col-span-2"
        iconSize="h-4 w-4"
        buttonSize="h-6 w-8"
        expandButtonSize="h-6 w-6"
        isMonth={isMonth}
        expandDataType={expandDataType}
        expandDisabled={expandDisabled}
        handleAddOperation={handleAddOperation}
      />
    </div>
  );
};

export default HeaderBlock;
