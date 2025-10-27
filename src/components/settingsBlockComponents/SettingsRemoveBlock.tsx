"use client";
import { useGlobal } from "@/context/GlobalContext";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { t } from "@/locales/locale";
import { Entity } from "./SettingsEntityBlock";

type SettingsRemoveProps = {
  type: "tracker" | "tag";
  idx: number;
  entity: Entity;
  handleClick: (type: "tracker" | "tag", idx: number) => void;
  handleClear: () => void;
};

const SettingsRemoveBlock = ({
  type,
  idx,
  entity,
  handleClick,
  handleClear,
}: SettingsRemoveProps) => {
  const { locale } = useGlobal();

  return (
    <div
      id={`delete-${type}`}
      className="absolute -top-3 -right-3 -left-3 -bottom-3 inset-0 bg-white/80 backdrop-blur-xs z-50 col-span-2 md:col-span-1 grid grid-cols-2 gap-2 rounded p-4"
    >
      <div className="mb-auto col-span-2 gap-2 mt-auto">
        <p className="text-lg text-center font-bold mx-auto">
          {`${t(locale, "body.modal.labelTitleDelete", {
            deleteEntity: t(locale, `body.modal.deleteEntity.${type}`),
          })} - ${entity.title}`}
        </p>
        {type === "tracker" && (
          <p className="mb-auto text-sm text-center font-semibold text-gray-600 mx-auto">
            Будут удалены все записи и тэги, связанные с этим трэкером.
          </p>
        )}
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-4 mt-auto">
        <MidLevelButton
          title={t(locale, "body.modal.labelDelete")}
          style="bg-red-300 hover:bg-red-400 border-red-400 h-9"
          handleClick={() => handleClick(type, idx)}
        />
        <MidLevelButton
          title={t(locale, "body.modal.labelCancel")}
          style="bg-blue-300 hover:bg-blue-400 border-blue-400 h-9"
          handleClick={handleClear}
        />
      </div>
    </div>
  );
};

export default SettingsRemoveBlock;
