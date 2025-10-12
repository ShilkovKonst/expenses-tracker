import DescPBlock from "../DescPBlock";

type OperationDescriptionBlockProps = {
  labelOperationTags: string;
  labelOperationDescription: string;
  labelOperationAmount: string;
  operationType: string;
  operationTags: string[];
  operationDescription: string;
  operationAmount: number;
};

const OperationDescriptionBlock: React.FC<OperationDescriptionBlockProps> = ({
  labelOperationTags,
  labelOperationDescription,
  labelOperationAmount,
  operationType,
  operationTags,
  operationDescription,
  operationAmount,
}) => {
  return (
    <div className="pl-4 py-2 col-span-5 grid grid-cols-4 gap-4 my-auto">
      <DescPBlock
        outerStyle="col-span-1"
        spanStyle="text-xs"
        label={labelOperationTags}
        value={operationTags}
      />
      <DescPBlock
        outerStyle="col-span-1"
        spanStyle={`${
          operationType === "income" ? "text-green-600" : "text-red-500"
        } text-xs truncate`}
        label={labelOperationAmount}
        value={operationAmount}
      />
      <DescPBlock
        outerStyle="col-span-2"
        spanStyle="text-xs"
        label={labelOperationDescription}
        value={operationDescription}
      />
    </div>
  );
};

export default OperationDescriptionBlock;
