/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { TrackerType, RecordTag } from "@/types/formTypes";
import { FC, MouseEvent as RME, useEffect, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon, AddTag, AddTracker, CloseIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import { useModal } from "@/context/ModalContext";
import SettingsPartial from "./SettingsPartial";
import MidLevelButton from "../buttonComponents/MidLevelButton";

type SettingsBlockProps = { handleClear: () => void };

const SettingsBlock: FC<SettingsBlockProps> = ({ handleClear }) => {
  const { locale } = useGlobal();
  const { setIsSettingsModal } = useModal();

  const [allTypes, setAllTypes] = useState<TrackerType[]>([]);
  const [currentType, setCurrentType] = useState<TrackerType>(allTypes[0]);
  const [newType, setNewType] = useState<TrackerType>({ id: -1, title: "" });

  const [allTags, setAllTags] = useState<RecordTag[]>([]);
  const [typeTags, setTypeTags] = useState<RecordTag[]>([]);
  const [newTag, setNewTag] = useState<RecordTag>({ tracker: "", title: "" });

  useEffect(() => {
    if (localStorage) {
      let raw = localStorage.getItem("recordTags");
      if (!raw) {
        throw new Error("Record tags already should be in local storage");
      } else {
        setAllTags(JSON.parse(raw));
      }
      raw = localStorage.getItem("trackerTypes");
      if (!raw) {
        throw new Error("Tracker types already should be in local storage");
      } else {
        setAllTypes(JSON.parse(raw));
      }
    }
  }, []);

  useEffect(() => {
    setCurrentType(allTypes[0]);
  }, [allTypes]);

  useEffect(() => {
    setTypeTags([...allTags.filter((t) => t.tracker === currentType.title)]);
  }, [currentType]);

  useEffect(() => {
    if (currentType)
      setTypeTags([...allTags.filter((t) => t.tracker === currentType.title)]);
  }, [allTags]);

  const handleClearFinal = () => {
    handleClear();
    setIsSettingsModal(false);
  };

  const handleUpdate = () => {
    if (localStorage) {
      localStorage.setItem("trackerTypes", JSON.stringify(allTypes));
      localStorage.setItem("recordTags", JSON.stringify(allTags));
      handleClearFinal();
    }
  };

  const handleAddNewType = (
    e: RME<HTMLButtonElement, MouseEvent>,
    newType: TrackerType
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

  const handleSelectType = (trackerType: TrackerType) => {
    const type = allTypes.find((tt) => tt.title === trackerType.title);
    if (type) setCurrentType(trackerType);
    // console.log(type)
  };

  return (
    <div className="relative grid grid-cols-2 gap-2">
      <TopLevelButton
        icon={<CloseIcon style="h-7 w-7" />}
        title=""
        style="absolute -top-3 -right-3 bg-blue-400 hover:bg-blue-500 col-span-2 md:col-span-1 h-9 w-9"
        handleClick={handleClearFinal}
      />
      <div className="col-span-2 pr-7 border-double">
        <h3 className={`block font-semibold uppercase text-base`}>
          {t(locale, `body.peronnalisation.title`)}
        </h3>
        <p className={`block font-semibold text-xs mt-2`}>
          {t(locale, `body.peronnalisation.description`)}
        </p>
      </div>
      <SettingsPartial<TrackerType>
        addIcon={
          <>
            <AddIcon style="h-3 w-3" />
            <AddTracker style="h-5 w-5" />
          </>
        }
        isTrackerType={true}
        dataType="form-new-type"
        tagStyle="bg-blue-400 hover:bg-blue-500 disabled:border-2 disabled:border-blue-50 disabled:border-dotted disabled:bg-blue-500 disabled:hover:bg-blue-500"
        allEntities={allTypes}
        newEntity={newType}
        currentEntity={currentType}
        setNewEntity={setNewType}
        handleSelect={handleSelectType}
        handleAddNew={handleAddNewType}
      />
      <SettingsPartial<RecordTag>
        addIcon={
          <>
            <AddIcon style="h-3 w-3" />
            <AddTag style="h-5 w-5" />
          </>
        }
        isTrackerType={false}
        dataType="form-new-tag"
        tagStyle="bg-blue-300 disabled:bg-blue-400 disabled:hover:bg-blue-400"
        allEntities={typeTags}
        newEntity={newTag}
        setNewEntity={setNewTag}
        handleAddNew={handleAddNewTag}
      />
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
  );
};

export default SettingsBlock;
