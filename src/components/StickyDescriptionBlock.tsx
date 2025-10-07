import { AddBudget, ExpandIcon } from "@/lib/icons";
import AccordionDescriptionBlock from "./AccordionDescriptionBlock";
import CostButton from "./CostButton";
import { Locale, t } from "@/locales/locale";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  locale: Locale;
  transformElement: (el: HTMLElement, attr: string) => void;
  isMonth: boolean;
  disabled: boolean;
};

const StickyDescriptionBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
  locale,
  transformElement,
  disabled,
}) => {
  return (
    <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-200 border-2 border-blue-300 sticky top-0 z-2">
      <AccordionDescriptionBlock
        labelMain={labelMain}
        budget={budget}
        costs={costs}
        balance={balance}
        isSticky={true}
      />
      <div className="col-span-2 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
        <CostButton
          icon={<AddBudget style="h-7 w-7" />}
          dataType=""
          dataUpdate=""
          title={t(locale, `body.form.accordionAddBudget`)}
          style="bg-blue-500 hover:bg-blue-400 h-11 w-11"
          handleClick={() => {}}
        />
        <CostButton
          icon={<ExpandIcon style="h-7 w-7" />}
          dataType={`${labelMain}`}
          dataUpdate=""
          title={t(locale, `body.form.accordionExpandCosts`)}
          style="bg-blue-400 hover:bg-blue-500 disabled:text-gray-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-11 w-11"
          handleClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default StickyDescriptionBlock;
