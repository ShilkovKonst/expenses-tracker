"use client";
import CostButton from "../../buttonComponents/CostButton";
import { Delete, Update } from "@/lib/icons";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import { transformElement } from "@/lib/utils/transformElement";
import { MouseEvent as ReactMouseEvent } from "react";

type OperationButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  expandDataType: string;
  handleDelete: (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    isDelete: boolean
  ) => void;
};

const OperationButtonBlock: React.FC<OperationButtonBlockProps> = ({
  outerStyle,
  iconSize,
  buttonSize,
  expandDataType,
  handleDelete,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${outerStyle} pr-2 gap-2 flex flex-row justify-end items-center`}
    >
      <CostButton
        icon={<Update style={iconSize} />}
        dataType={expandDataType}
        title={t(locale, `body.form.operations.update`)}
        style={`bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={(e) =>
          transformElement(e.target as HTMLElement, "data-type")
        }
      />
      <CostButton
        icon={<Delete style={iconSize} />}
        dataType={``}
        dataUpdate={``}
        title={t(locale, `body.form.operations.remove`)}
        style={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={(e) => handleDelete(e, true)}
      />
    </div>
  );
};

export default OperationButtonBlock;
