"use client";
import { DeleteIcon, UpdateIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { RecordModalType } from "@/context/ModalContext";
import { TopLevelButton } from "@/components/buttonComponents";

type RecordButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  handleCallFormModal: (type: RecordModalType) => void;
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
      className={`${outerStyle} gap-2 flex flex-col sm:flex-row justify-start sm:justify-end items-end sm:items-center`}
    >
      <TopLevelButton
        icon={<UpdateIcon className={iconSize} />}
        title={t(locale, `body.form.operations.update`)}
        customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("upd")}
      />
      <TopLevelButton
        icon={<DeleteIcon className={iconSize} />}
        title={t(locale, `body.form.operations.remove`)}
        customStyle={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={() => handleCallFormModal("del")}
      />
    </div>
  );
};

export default RecordButtonBlock;
