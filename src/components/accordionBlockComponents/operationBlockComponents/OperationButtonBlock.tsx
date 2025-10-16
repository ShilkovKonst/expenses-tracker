"use client";
import CostButton from "../../buttonComponents/CostButton";
import { Delete, Update } from "@/lib/icons";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";

type OperationButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  handleCallFormModal: (
    type: "operationCrt" | "operationUpd" | "operationDel"
  ) => void;
};

const OperationButtonBlock: React.FC<OperationButtonBlockProps> = ({
  outerStyle,
  iconSize,
  buttonSize,
  handleCallFormModal,
}) => {
  const { locale } = useGlobal();

  return (
    <div
      className={`${outerStyle} pr-2 gap-2 flex flex-row justify-end items-center`}
    >
      <CostButton
        icon={<Update style={iconSize} />}
        title={t(locale, `body.form.operations.update`)}
        style={`bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("operationUpd")}
      />
      <CostButton
        icon={<Delete style={iconSize} />}
        title={t(locale, `body.form.operations.remove`)}
        style={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("operationDel")}
      />
    </div>
  );
};

export default OperationButtonBlock;
