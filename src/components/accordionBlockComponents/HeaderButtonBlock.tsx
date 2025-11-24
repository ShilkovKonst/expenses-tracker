"use client";
import { useGlobal } from "@/context/GlobalContext";
import { AddIcon, ExpandIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { transformElement } from "@/lib/utils/transformElement";
import { MouseEvent as RME } from "react";
import { TopLevelButton } from "../buttonComponents";

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
        <TopLevelButton
          icon={<AddIcon className={"h-4 w-4"} />}
          title={t(locale, `body.form.operations.add`)}
          customStyle={`bg-blue-500 hover:bg-blue-400 h-6 w-8`}
          handleClick={handleAddOperation}
        />
      )}
      {
        <TopLevelButton
          icon={<ExpandIcon className={"h-4 w-4"} />}
          title={t(locale, `body.form.operations.expand`)}
          customStyle={`bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 h-6 w-6`}
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
