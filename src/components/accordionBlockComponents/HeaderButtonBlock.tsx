"use client";
import { useGlobal } from "@/context/GlobalContext";
import { AddIcon, ExpandIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { transformElement } from "@/lib/utils/transformElement";
import { MouseEvent as RME } from "react";
import { UtilButton } from "../buttonComponents";

type HeaderButtonBlockProps = {
  expandDataType: string;
  expandDisabled?: boolean;
  isMonth?: boolean;
  handleAddOperation?: () => void;
};

const HeaderButtonBlock: React.FC<HeaderButtonBlockProps> = ({
  isMonth,
  expandDataType,
  expandDisabled,
  handleAddOperation,
}) => {
  const { locale } = useGlobal();

  return (
    <div
      className={`col-span-2 pr-2 gap-2 flex flex-row justify-end items-center`}
    >
      {isMonth && handleAddOperation && (
        <UtilButton
          icon={<AddIcon className={"h-6 w-6 md:h-4 md:w-4"} />}
          title={t(locale, `body.buttons.add`)}
          customStyle={`bg-blue-500 hover:bg-blue-400 h-7.5 w-7.5 md:h-6 md:w-6`}
          handleClick={handleAddOperation}
        />
      )}
      {
        <UtilButton
          icon={<ExpandIcon className={"h-6 w-6 md:h-4 md:w-4"} />}
          title={t(locale, `body.buttons.expand`)}
          customStyle={`bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-7.5 w-7.5 md:h-6 md:w-6`}
          handleClick={(e: RME<HTMLButtonElement, MouseEvent>) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
          disabled={expandDisabled}
          dataType={expandDataType}
        />
      }
    </div>
  );
};

export default HeaderButtonBlock;
