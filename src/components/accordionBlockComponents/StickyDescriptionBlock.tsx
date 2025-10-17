"use client";
import { ExpandIcon } from "@/lib/icons";
import DescriptionBlock from "./DescriptionBlock";
import CostButton from "../buttonComponents/CostButton";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";

type DescriptionProps = {
  labelMain: string;
  totalAmount: number;
  transformElement: (el: HTMLElement, attr: string) => void;
  isMonth: boolean;
  disabled: boolean;
};

const StickyDescriptionBlock: React.FC<DescriptionProps> = ({
  labelMain,
  totalAmount,
  transformElement,
  disabled,
}) => {
  const { locale } = useGlobal();
  return (
    <div className="col-span-6 grid grid-cols-6 gap-3 w-full bg-blue-200 border-2 border-blue-300 sticky top-0 z-2">
      <DescriptionBlock
        labelMain={labelMain}
        totalAmount={totalAmount}
      />
      <div className="col-span-2 pr-2 gap-2 flex flex-col justify-center items-end lg:flex-row lg:justify-end lg:items-center *:text-sm *:md:text-base">
        <CostButton
          icon={<ExpandIcon style="h-7 w-7" />}
          dataType={`${labelMain}`}
          dataUpdate=""
          title={t(locale, `body.form.operations.expand`)}
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
