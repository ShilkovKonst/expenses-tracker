"use client";
import {
  Dispatch,
  ReactNode,
  MouseEvent as RME,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { AddIcon, DeleteIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import { RecordTag, TrackerName } from "@/lib/types/dataTypes";
import { useGlobal } from "@/context/GlobalContext";
import { compare } from "@/lib/utils/compareHelper";
import { LowLevelButton, TagButton, TopLevelButton } from "../buttonComponents";

export type Entity = TrackerName | RecordTag;

type SettingsEntityProps = {
  dataType: string;
  addIcon: ReactNode;
  currentEntity?: RecordTag;
  recordTags: Record<string, string>;
  newEntity: string;
  setExpanded?: Dispatch<SetStateAction<number>>;
  setNewEntity: Dispatch<SetStateAction<string>>;
  handleAddNew: (
    e: RME<HTMLButtonElement, MouseEvent>,
    newEntity: string
  ) => void;
};

const SettingsEntityBlock = ({
  dataType,
  addIcon,
  currentEntity,
  recordTags,
  newEntity,
  setExpanded,
  setNewEntity,
  handleAddNew,
}: SettingsEntityProps) => {
  const { locale } = useGlobal();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsDisabled(Object.values(recordTags).some((t) => t === newEntity));
  }, [newEntity, recordTags]);

  const handleRemove = (idx: number) => {
    if (setExpanded) setExpanded(idx);
  };

  return (
    <div className="col-span-2 grid grid-cols-2 border-t-2 border-blue-100">
      <div className="col-span-2 w-full pt-2 flex flex-wrap items-center gap-6">
        {Object.values(recordTags)
          .sort((a, b) => compare(a, b))
          .map((entity, i) => (
            <div key={i} className="relative flex">
              <TagButton
                tag={entity}
                handleClick={() => {}}
                customStyle={`bg-blue-300 disabled:bg-blue-400 disabled:hover:bg-blue-400 pr-6 h-7 rounded-r-none`}
                disabled={currentEntity && currentEntity.title === entity}
              />
              <LowLevelButton
                icon={<DeleteIcon className="h-5 w-5" />}
                customStyle="absolute top-0 -right-3 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
                handleClick={() => handleRemove(i)}
              />
            </div>
          ))}
        {Object.values(recordTags).length === 0 && (
          <p className={`max-w-3/4 block font-medium text-xs text-gray-500`}>
            {t(locale, `body.form.operations.tagTitleEmpty`)}
          </p>
        )}
        <TopLevelButton
          icon={addIcon}
          title="add new tag"
          dataType={dataType}
          customStyle="bg-green-400 hover:bg-green-500"
          handleClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
        />
      </div>
      <form
        style={{ height: 0 }}
        id={dataType}
        className="col-span-2 grid grid-cols-5 gap-2 w-full mt-2 overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <input
          className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-xs"
          placeholder={t(locale, `body.form.operations.tagCustomTitle`)}
          type="text"
          value={newEntity}
          onChange={(e) => setNewEntity(e.target.value)}
        />
        <TopLevelButton
          icon={<AddIcon className="w-5 h-5" />}
          dataType={dataType}
          title="???"
          handleClick={(e: RME<HTMLButtonElement, MouseEvent>) =>
            handleAddNew(e, newEntity)
          }
          customStyle="mr-auto h-7 w-7 bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
          disabled={isDisabled || newEntity === ""}
        />
        {isDisabled && (
          <p className="col-span-6 text-xs text-red-600 my-auto">
            {t(locale, `body.form.tracker.typeDouble`)}
          </p>
        )}
      </form>
    </div>
  );
};

export default SettingsEntityBlock;
