"use client";
import TopLevelButton from "../../buttonComponents/TopLevelButton";
import { DeleteIcon, UpdateIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ModalBodyType } from "@/context/ModalContext";

type RecordButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  handleCallFormModal: (type: ModalBodyType) => void;
};

const RecordButtonBlock: React.FC<RecordButtonBlockProps> = ({
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
      <TopLevelButton
        icon={<UpdateIcon className={iconSize} />}
        title={t(locale, `body.form.operations.update`)}
        style={`h-full sm:h-auto bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("upd")}
      />
      <TopLevelButton
        icon={<DeleteIcon className={iconSize} />}
        title={t(locale, `body.form.operations.remove`)}
        style={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("del")}
      />
    </div>
  );
};

export default RecordButtonBlock;
