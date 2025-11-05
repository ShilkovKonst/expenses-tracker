"use client";
import { TrackerName, RecordTag } from "@/types/formTypes";
import { FC, MouseEvent as RME, useEffect, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon, AddTagIcon, AddTrackerIcon, CloseIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import SettingsEntityBlock from "./SettingsEntityBlock";
import SettingsRemoveBlock from "./SettingsRemoveBlock";
import { useModal } from "@/context/ModalContext";

type SettingsBlockProps = { handleClear: () => void };

export type RemoveType = { type: "tag" | "tracker"; idx: number };

const SettingsBlock: FC<SettingsBlockProps> = ({ handleClear }) => {
  const { locale, trackerTypes, setTrackerTypes, recordTags, setRecordTags } =
    useGlobal();
  const { setIsSettingsModal } = useModal();

  const [allTypes, setAllTypes] = useState<TrackerName[]>(trackerTypes);
  const [currentType, setCurrentType] = useState<TrackerName>(trackerTypes[0]);
  const [newType, setNewType] = useState<TrackerName>({ id: -1, title: "" });

  const [allTags, setAllTags] = useState<RecordTag[]>(recordTags);
  const [typeTags, setTypeTags] = useState<RecordTag[]>([]);
  const [newTag, setNewTag] = useState<RecordTag>({ tracker: "", title: "" });
  const [expanded, setExpanded] = useState<RemoveType | undefined>();

  const [removedTrackers, setRemovedTrackers] = useState<TrackerName[]>([]);

  useEffect(() => {
    setTypeTags([...allTags.filter((t) => t.tracker === currentType.title)]);
  }, [currentType, allTags]);

  const handleClearFinal = () => {
    handleClear();
    setIsSettingsModal(false);
    setExpanded(undefined);
  };

  const handleSelectType = (trackerType: TrackerName) => {
    const type = allTypes.find((tt) => tt.title === trackerType.title);
    if (type) setCurrentType(trackerType);
    else throw new Error("type must be in types list");
  };

  const handleAddNewType = (
    e: RME<HTMLButtonElement, MouseEvent>,
    newType: TrackerName
  ) => {
    setAllTypes([...allTypes, { ...newType, id: allTypes.length }]);
    setNewType({ id: -1, title: "" });
    transformElement(e.target as HTMLElement, "data-type");
  };

  const handleAddNewTag = (
    e: RME<HTMLButtonElement, MouseEvent>,
    newTag: RecordTag
  ) => {
    setAllTags([...allTags, { ...newTag, tracker: currentType.title }]);
    setNewTag({ tracker: "", title: "" });
    transformElement(e.target as HTMLElement, "data-type");
  };

  const handleRemove = (type: "tracker" | "tag", idx: number) => {
    if (type === "tag") {
      console.log(typeTags);
      const tag = typeTags[idx];
      setAllTags(allTags.filter((e) => e.title !== tag.title));
    }
    if (type === "tracker") {
      const trackerType = allTypes[idx];
      setAllTypes(allTypes.filter((e) => e.title !== trackerType.title));
      setAllTags(allTags.filter((e) => e.tracker !== trackerType.title));
      setRemovedTrackers([...removedTrackers, trackerType]);
    }
    setExpanded(undefined);
  };

  const handleUpdate = () => {
    if (localStorage) {
      setTrackerTypes(allTypes);
      setRecordTags(allTags);
      localStorage.setItem("trackerTypes", JSON.stringify(allTypes));
      localStorage.setItem("recordTags", JSON.stringify(allTags));
      for (const trackerType of removedTrackers) {
        localStorage.removeItem(trackerType.title);
      }
      handleClearFinal();
    }
  };

  return (
    <div className="relative grid grid-cols-2 gap-2">
      {expanded && (
        <SettingsRemoveBlock
          entity={
            expanded.type === "tag"
              ? typeTags[expanded.idx]
              : allTypes[expanded.idx]
          }
          type={expanded.type}
          idx={expanded.idx}
          handleClear={() => (setExpanded ? setExpanded(undefined) : {})}
          handleClick={handleRemove}
        />
      )}
      <TopLevelButton
        icon={<CloseIcon className="h-7 w-7" />}
        title=""
        style="absolute -top-3 -right-3 bg-blue-400 hover:bg-blue-500 col-span-2 md:col-span-1 h-9 w-9"
        handleClick={handleClearFinal}
      />
      <div className="col-span-2 pr-7 border-double">
        <h3 className={`block font-semibold uppercase text-base`}>
          {t(locale, `body.peronnalisation.title`)}
        </h3>
        <p className={`block font-semibold text-xs mt-2 `}>
          {t(locale, `body.peronnalisation.description`)}
        </p>
      </div>
      <SettingsEntityBlock<TrackerName>
        addIcon={<AddTrackerIcon className="h-5 w-7" />}
        isTrackerType={true}
        dataType="form-new-type"
        tagStyle="bg-blue-400 hover:bg-blue-500 disabled:bg-green-500 disabled:hover:bg-green-500"
        allEntities={allTypes}
        newEntity={newType}
        currentEntity={currentType}
        setNewEntity={setNewType}
        expanded={expanded}
        setExpanded={setExpanded}
        handleSelect={handleSelectType}
        handleAddNew={handleAddNewType}
      />
      <SettingsEntityBlock<RecordTag>
        addIcon={
          <>
            <AddIcon className="h-3 w-3" />
            <AddTagIcon className="h-5 w-5" />
          </>
        }
        isTrackerType={false}
        dataType="form-new-tag"
        tagStyle="bg-blue-300 disabled:bg-blue-400 disabled:hover:bg-blue-400"
        allEntities={typeTags}
        newEntity={newTag}
        setNewEntity={setNewTag}
        expanded={expanded}
        setExpanded={setExpanded}
        handleAddNew={handleAddNewTag}
      />
      <div className="col-span-2 grid grid-cols-2 gap-2 pt-2 border-t-2 border-blue-100">
        <MidLevelButton
          title={t(locale, "body.modal.labelConfirm")}
          style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1 disabled:text-gray-600 disabled:bg-green-200 disabled:hover:bg-green-200 disabled:border-green-300"
          handleClick={handleUpdate}
        />
        <MidLevelButton
          title={t(locale, "body.modal.labelCancel")}
          style="bg-blue-300 hover:bg-blue-400 border-blue-400 cols-span-1"
          handleClick={handleClearFinal}
        />
      </div>
    </div>
  );
};

export default SettingsBlock;
