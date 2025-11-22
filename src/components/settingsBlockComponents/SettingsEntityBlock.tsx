"use client";
import {
  Dispatch,
  ReactNode,
  MouseEvent as RME,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon, DeleteIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import TagButton from "../buttonComponents/TagButton";
import { RecordTag, TrackerName } from "@/lib/types/dataTypes";
import { useGlobal } from "@/context/GlobalContext";
import LowLevelButton from "../buttonComponents/LowLevelButton";
import { compare } from "@/lib/utils/compareHelper";

export type Entity = TrackerName | RecordTag;

type SettingsEntityProps = {
  dataType: string;
  addIcon: ReactNode;
  tagStyle: string;
  currentEntity?: RecordTag;
  recordTags: Record<string, string>;
  newEntity: string;
  setNewEntity: Dispatch<SetStateAction<string>>;
  expanded?: number;
  setExpanded?: Dispatch<SetStateAction<number>>;
  handleAddNew: (
    e: RME<HTMLButtonElement, MouseEvent>,
    newEntity: string
  ) => void;
};

const SettingsEntityBlock = ({
  dataType,
  addIcon,
  tagStyle,
  currentEntity,
  recordTags,
  newEntity,
  expanded,
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
                style={`h-7 ${tagStyle} transition-colors duration-200 ease-in-out rounded-r-none pr-6`}
                disabled={currentEntity && currentEntity.title === entity}
              />
              <LowLevelButton
                icon={<DeleteIcon className="h-5 w-5" />}
                style="absolute top-0 -right-3 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
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
          title=""
          dataType={dataType}
          style="bg-green-400 hover:bg-green-500 transition-colors duration-200 ease-in-out"
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
          title=""
          handleClick={(e: RME<HTMLButtonElement, MouseEvent>) =>
            handleAddNew(e, newEntity)
          }
          style="col-span-1 mr-auto h-7 w-7 rounded-sm cursor-pointer flex justify-center items-center 
                  bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600
                  transition-colors duration-200 ease-in-out"
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
