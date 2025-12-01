"use client";
import { DeleteIcon, UpdateIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { UtilButton } from "@/components/buttonComponents";

type ButtonBlockProps = {
  outerStyle: string;
  iconSize: string;
  buttonSize: string;
  handleUpdate: () => void;
  handleDelete: () => void;
};

const ButtonBlock: React.FC<ButtonBlockProps> = ({
  outerStyle,
  iconSize,
  buttonSize,
  handleUpdate,
  handleDelete,
}) => {
  const { locale } = useGlobal();

  return (
    <div
      className={`${outerStyle} gap-2 flex flex-col sm:flex-row justify-start sm:justify-end items-end sm:items-center`}
    >
      <UtilButton
        icon={<UpdateIcon className={iconSize} />}
        title={t(locale, `body.buttons.update`)}
        customStyle={`sm:h-auto bg-blue-400 hover:bg-blue-500 ${buttonSize}`}
        handleClick={handleUpdate}
      />
      <UtilButton
        icon={<DeleteIcon className={iconSize} />}
        title={t(locale, `body.buttons.delete`)}
        customStyle={`bg-red-400 hover:bg-red-500 ${buttonSize}`}
        handleClick={handleDelete}
      />
    </div>
  );
};

export default ButtonBlock;
