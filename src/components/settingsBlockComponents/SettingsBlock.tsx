"use client";
import { FC, MouseEvent as RME, useEffect, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import TopLevelButton from "../buttonComponents/TopLevelButton";
import { AddIcon, AddTagIcon, CloseIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { t } from "@/locales/locale";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import SettingsEntityBlock from "./SettingsEntityBlock";
import SettingsRemoveBlock from "./SettingsRemoveBlock";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";

type SettingsBlockProps = { handleClear: () => void };

const SettingsBlock: FC<SettingsBlockProps> = ({ handleClear }) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();
  const { setIsSettingsModal } = useModal();

  const [tags, setTags] = useState<Record<string, string>>();
  const [newTag, setNewTag] = useState<string>("");
  const [expanded, setExpanded] = useState<string>("");

  useEffect(() => {
    if (trackerTags) {
      setTags({ ...trackerTags });
    }
  }, [trackerTags]);

  const handleClearFinal = () => {
    handleClear();
    setIsSettingsModal(false);
    setExpanded("");
  };

  const handleAddNewTag = (
    e: RME<HTMLButtonElement, MouseEvent>,
    newTag: string
  ) => {
    if (tags) {
      const id = `t${Object.values(tags).length}`;
      setTags({
        ...tags,
        [id]: newTag,
      });
      setNewTag("");
      transformElement(e.target as HTMLElement, "data-type");
    }
  };

  const handleRemove = (idx: string) => {
    const updatedTags = { ...tags };
    delete updatedTags[idx];

    setTags(updatedTags);
    setExpanded("");
  };

  const handleUpdate = () => {
    // if (localStorage) {
    //   setRecordTags(allTags);
    //   localStorage.setItem("trackerTypes", JSON.stringify(allTypes));
    //   localStorage.setItem("recordTags", JSON.stringify(allTags));
    //   for (const trackerType of removedTrackers) {
    //     localStorage.removeItem(trackerType.title);
    //   }
    // }
    handleClearFinal();
  };

  return (
    <div className="relative grid grid-cols-2 gap-2">
      {tags && expanded && (
        <SettingsRemoveBlock
          entity={tags[`t${expanded}`]}
          idx={`t${expanded}`}
          handleClear={() => (setExpanded ? setExpanded("") : {})}
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
      {tags && (
        <SettingsEntityBlock
          addIcon={
            <>
              <AddIcon className="h-3 w-3" />
              <AddTagIcon className="h-5 w-5" />
            </>
          }
          dataType="form-new-tag"
          tagStyle="bg-blue-300 disabled:bg-blue-400 disabled:hover:bg-blue-400"
          recordTags={tags}
          newEntity={newTag}
          setNewEntity={setNewTag}
          handleAddNew={handleAddNewTag}
        />
      )}

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
