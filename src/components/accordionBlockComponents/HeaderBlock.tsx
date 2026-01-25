import DescriptionBlock from "./DescriptionBlock";
import HeaderButtonBlock from "./HeaderButtonBlock";

type DescriptionPropsType = {
  labelMain: string;
  totalAmount: number;
  totalRecords: number;
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
  totalRecords,
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
      className={`header py-1 col-span-6 grid grid-cols-6 gap-3 w-full border-2 ${
        isMonth ? "bg-blue-150 border-blue-200" : "bg-blue-200 border-blue-300"
      }`}
    >
      <DescriptionBlock
        labelMain={`${labelMain}`}
        totalAmount={totalAmount}
        totalRecords={totalRecords}
        isMonth={isMonth}
      />
      <HeaderButtonBlock
        isMonth={isMonth}
        expandDataType={expandDataType}
        expandDisabled={expandDisabled}
        handleAddOperation={handleAddOperation}
      />
    </div>
  );
};

export default HeaderBlock;
