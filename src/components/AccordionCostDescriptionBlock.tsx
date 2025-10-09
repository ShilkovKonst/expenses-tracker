type AccordionDescriptionPropsType = {
  labelCostType: string;
  labelCostDescription: string;
  labelCostAmount: string;
  costType: string;
  costDescription: string;
  costAmount: number;
};

const AccordionCostDescriptionBlock: React.FC<
  AccordionDescriptionPropsType
> = ({
  labelCostType,
  labelCostDescription,
  labelCostAmount,
  costType,
  costDescription,
  costAmount,
}) => {
  return (
    <div className="pl-4 py-2 col-span-5 grid grid-cols-3 lg:grid-cols-4 gap-4 my-auto">
      <div className="col-span-2 lg:col-span-1 flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
            {labelCostType}
          </span>
        </div>
        <span className="font-bold text-base">{costType}</span>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
            {labelCostAmount}
          </span>
        </div>
        <span className="font-bold text-red-500 text-base">
          {costAmount}
        </span>
      </div>
      <div className="col-span-3 lg:col-span-2 flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
            {labelCostDescription}
          </span>
        </div>
        <span className="font-bold text-sm">
          {costDescription}
        </span>
      </div>
    </div>
  );
};

export default AccordionCostDescriptionBlock;
