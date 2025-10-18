import DescPBlock from "../DescPBlock";

type OperationDescriptionBlockProps = {
  outerStyle: string;
  labelOperationTags: string;
  labelOperationDescription: string;
  labelOperationAmount: string;
  operationType: string;
  operationTags: string[];
  operationDescription: string;
  operationAmount: number;
};

const OperationDescriptionBlock: React.FC<OperationDescriptionBlockProps> = ({
  outerStyle,
  labelOperationTags,
  labelOperationDescription,
  labelOperationAmount,
  operationType,
  operationTags,
  operationDescription,
  operationAmount,
}) => {
  return (
    <div className={outerStyle}>
      <DescPBlock
        outerStyle="col-span-1 flex flex-col lg:flex-row lg:gap-1 justify-start items-start"
        spanStyle="text-xs"
        label={labelOperationTags}
        value={operationTags}
      />
      <DescPBlock
        outerStyle="col-span-1 flex flex-col lg:flex-row lg:gap-1 justify-start items-start"
        spanStyle={`${
          operationType === "income" ? "text-green-600" : "text-red-500"
        } text-xs truncate`}
        label={labelOperationAmount}
        value={operationAmount}
      />
      <DescPBlock
        outerStyle="col-span-2 flex flex-col lg:flex-row lg:gap-1 justify-start items-start"
        spanStyle="text-xs"
        label={labelOperationDescription}
        value={operationDescription}
      />
    </div>
  );
};

export default OperationDescriptionBlock;
