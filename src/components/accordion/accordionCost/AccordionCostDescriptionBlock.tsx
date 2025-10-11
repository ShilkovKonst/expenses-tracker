import AccordionDescPBlock from "../AccordionDescPBlock";

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
    <div className="pl-4 py-2 col-span-5 grid grid-cols-4 gap-4 my-auto">
      <AccordionDescPBlock
        outerStyle="col-span-1"
        spanStyle="text-xs"
        label={labelCostType}
        value={costType}
      />
      <AccordionDescPBlock
        outerStyle="col-span-1"
        spanStyle="text-red-500 text-xs truncate"
        label={labelCostAmount}
        value={costAmount}
      />
      <AccordionDescPBlock
        outerStyle="col-span-2"
        spanStyle="text-xs"
        label={labelCostDescription}
        value={costDescription}
      />
    </div>
  );
};

export default AccordionCostDescriptionBlock;
