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
import { AddIcon, Delete } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import TagButton from "../buttonComponents/TagButton";
import { RecordTag, TrackerName } from "@/types/formTypes";
import { useGlobal } from "@/context/GlobalContext";
import { RemoveType } from "./SettingsBlock";
import LowLevelButton from "../buttonComponents/LowLevelButton";
import { compare } from "@/lib/utils/compareHelper";

export type Entity = TrackerName | RecordTag;

type SettingsEntityProps<T extends Entity> = {
  isTrackerType: boolean;
  dataType: string;
  addIcon: ReactNode;
  tagStyle: string;
  allEntities: T[];
  currentEntity?: T;
  newEntity: T;
  setNewEntity: Dispatch<SetStateAction<T>>;
  expanded?: RemoveType;
  setExpanded?: Dispatch<SetStateAction<RemoveType | undefined>>;
  handleSelect?: (entity: T) => void;
  handleAddNew: (e: RME<HTMLButtonElement, MouseEvent>, newEntity: T) => void;
};

const SettingsEntityBlock = <T extends Entity>({
  isTrackerType,
  dataType,
  addIcon,
  tagStyle,
  allEntities,
  currentEntity,
  newEntity,
  setExpanded,
  setNewEntity,
  handleSelect,
  handleAddNew,
}: SettingsEntityProps<T>) => {
  const { locale } = useGlobal();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsDisabled(allEntities.some((tt) => tt.title === newEntity.title));
  }, [newEntity, allEntities]);

  const handleRemove = (type: "tracker" | "tag", idx: number) => {
    if (setExpanded) setExpanded({ type: type, idx: idx });
  };

  return (
    <div className="col-span-2 grid grid-cols-2 border-t-2 border-blue-100">
      <div className="col-span-2 w-full pt-2 flex flex-wrap items-center gap-6">
        {allEntities
          .sort((a, b) => compare(a.title, b.title))
          .map((entity, i) => (
            <div key={i} className="relative flex">
              <TagButton
                tag={entity.title}
                handleClick={
                  isTrackerType && handleSelect
                    ? () => handleSelect(entity)
                    : () => {}
                }
                style={`h-7 ${tagStyle} transition-colors duration-200 ease-in-out rounded-r-none pr-6`}
                disabled={currentEntity && currentEntity.title === entity.title}
              />
              <LowLevelButton
                icon={<Delete style="h-5 w-5" />}
                style="absolute top-0 -right-3 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
                handleClick={() =>
                  handleRemove(isTrackerType ? "tracker" : "tag", i)
                }
              />
            </div>
          ))}
        {allEntities.length === 0 && (
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
          placeholder={
            isTrackerType
              ? t(locale, `body.form.tracker.typeCustomTitle`)
              : t(locale, `body.form.operations.tagCustomTitle`)
          }
          type="text"
          value={newEntity.title}
          onChange={(e) =>
            setNewEntity({ ...newEntity, title: e.target.value })
          }
        />
        <TopLevelButton
          icon={<AddIcon style="w-5 h-5" />}
          dataType={dataType}
          title=""
          handleClick={(e: RME<HTMLButtonElement, MouseEvent>) =>
            handleAddNew(e, newEntity)
          }
          style="col-span-1 mr-auto h-7 w-7 rounded-sm cursor-pointer flex justify-center items-center 
                  bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600
                  transition-colors duration-200 ease-in-out"
          disabled={isDisabled || newEntity.title === ""}
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
