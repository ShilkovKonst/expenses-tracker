"use client";
import CostButton from "../../buttonComponents/CostButton";
import { Delete, Update } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ModalBodyType } from "@/context/ModalContext";

type OperationButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  handleCallFormModal: (
    type: ModalBodyType
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
      className={`${outerStyle} gap-2 flex flex-col sm:flex-row justify-center sm:justify-end items-end sm:items-center`}
    >
      <CostButton
        icon={<Update style={iconSize} />}
        title={t(locale, `body.form.operations.update`)}
        style={`bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("upd")}
      />
      <CostButton
        icon={<Delete style={iconSize} />}
        title={t(locale, `body.form.operations.remove`)}
        style={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("del")}
      />
    </div>
  );
};

export default OperationButtonBlock;
