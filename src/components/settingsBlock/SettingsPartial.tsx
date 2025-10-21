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
import { AddIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import TagButton from "../buttonComponents/TagButton";
import { RecordTag, TrackerType } from "@/types/formTypes";
import { useGlobal } from "@/context/GlobalContext";

type Entity = TrackerType | RecordTag;

type SettingsPartialProps<T extends Entity> = {
  isTrackerType: boolean;
  dataType: string;
  addIcon: ReactNode;
  tagStyle: string;
  allEntities: T[];
  currentEntity?: T;
  newEntity: T;
  setNewEntity: Dispatch<SetStateAction<T>>;
  handleSelect?: (entity: T) => void;
  handleAddNew: (e: RME<HTMLButtonElement, MouseEvent>, newEntity: T) => void;
};

const SettingsPartial = <T extends Entity>({
  isTrackerType,
  dataType,
  addIcon,
  tagStyle,
  allEntities,
  currentEntity,
  newEntity,
  setNewEntity,
  handleSelect,
  handleAddNew,
}: SettingsPartialProps<T>) => {
  const { locale } = useGlobal();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsDisabled(allEntities.some((tt) => tt.title === newEntity.title));
  }, [newEntity, allEntities]);

  return (
    <div className="col-span-2 border-t-2 border-blue-100">
      <div className="relative w-full pt-2 flex flex-wrap items-center gap-2">
        {allEntities.map((entity, i) => (
          <TagButton
            key={i}
            tag={entity.title}
            handleClick={
              isTrackerType && handleSelect
                ? () => handleSelect(entity)
                : () => {}
            }
            style={`h-7 ${tagStyle} transition-colors duration-200 ease-in-out`}
            disabled={currentEntity && currentEntity.title === entity.title}
          />
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
          style="bg-green-300 hover:bg-green-400 transition-colors duration-200 ease-in-out"
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

export default SettingsPartial;
