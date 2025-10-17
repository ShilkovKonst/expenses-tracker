"use client";
import { useGlobal } from "@/context/GlobalContext";
import { AddCost, AddIcon, ExpandIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import CostButton from "../buttonComponents/CostButton";
import { transformElement } from "@/lib/utils/transformElement";
import { MouseEvent as RMouseEvent } from "react";

type HeaderButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  expandButtonSize: string;
  expandDataType: string;
  expandDisabled?: boolean;
  isMonth?: boolean;
  handleAddOperation?: () => void;
};

const HeaderButtonBlock: React.FC<HeaderButtonBlockProps> = ({
  outerStyle,
  iconSize,
  buttonSize,
  isMonth,
  expandButtonSize,
  expandDataType,
  expandDisabled,
  handleAddOperation,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${outerStyle} pr-2 gap-2 flex flex-row justify-end items-center`}
    >
      {isMonth && handleAddOperation && (
        <CostButton
          icon={<AddIcon style={iconSize} />}
          title={t(locale, `body.form.operations.add`)}
          style={`bg-blue-500 hover:bg-blue-400 ${buttonSize}`}
          handleClick={handleAddOperation}
        />
      )}
      <CostButton
        icon={<ExpandIcon style={iconSize} />}
        dataType={expandDataType}
        title={t(locale, `body.form.operations.expand`)}
        style={`bg-blue-400 hover:bg-blue-500 disabled:text-gray-600 disabled:bg-blue-300 disabled:hover:bg-blue-300 ${expandButtonSize}`}
        handleClick={(e) =>
          transformElement(e.target as HTMLElement, "data-type")
        }
        disabled={expandDisabled}
      />
    </div>
  );
};

export default HeaderButtonBlock;
