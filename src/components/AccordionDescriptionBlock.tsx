type AccordionDescriptionPropsType = {
  labelMain: string;
  labelBudget?: string;
  labelCosts?: string;
  labelBalance?: string;
  budget: number;
  costs: number;
  balance: number;
  isSticky?: boolean;
};

const AccordionDescriptionBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  labelBudget,
  labelCosts,
  labelBalance,
  budget,
  costs,
  balance,
  isSticky,
}) => {
  return (
    <div className="pl-4 py-2 col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
      <div className="col-span-1 my-auto">
        <h3 className="text-lg lg:text-xl font-bold text-blue-800 capitalize mb-1">
          {labelMain}
        </h3>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {labelBudget}
            </span>
          </div>
        )}
        <span className="font-bold text-green-600 text-base lg:text-lg">
          {budget}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {labelCosts}
            </span>
          </div>
        )}
        <span className="font-bold text-red-600 text-base lg:text-lg">
          {costs}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {labelBalance}
            </span>
          </div>
        )}
        <span className="font-bold text-red-500 text-base lg:text-lg">
          {balance}
        </span>
      </div>
    </div>
  );
};

export default AccordionDescriptionBlock;
