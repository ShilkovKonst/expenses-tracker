"use client";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IconButton } from "../buttonComponents";
import { AddIcon, UpdateIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { createTag, updateTagById } from "@/idb/CRUD/tagsCRUD";
import { TagId } from "@/lib/types/brand";
import { createTagId } from "@/lib/types/dataTypes";
import { TagObj } from "../modals/settings/SettingsBlock";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";

type FormNewTagProps = {
  recordTags?: TagId[];
  setRecordTags?: Dispatch<SetStateAction<TagId[]>>;
  tag?: TagObj;
  setTag?: Dispatch<SetStateAction<TagObj | undefined>>;
};

const FormNewTagBlock = ({
  recordTags,
  setRecordTags,
  tag,
  setTag,
}: FormNewTagProps) => {
  const { locale } = useGlobal();
  const {
    trackerId,
    trackerMeta,
    trackerTags,
    setTrackerTags,
    setTrackerMeta,
  } = useTracker();

  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    if (tag) setNewTag(tag.title);
  }, [tag]);

  const isDisabled = useMemo(
    () => Object.values(trackerTags ?? []).some((t) => t === newTag),
    [newTag, trackerTags]
  );

  const handleAddNewTag = useCallback(
    async (newTag: string) => {
      let id;
      if (tag) {
        id = await updateTagById(trackerId, tag.id, newTag);
      } else {
        id = await createTag(trackerId, newTag);
      }
      if (recordTags && setRecordTags)
        setRecordTags([...recordTags, createTagId(id)]);
      setTrackerTags({ ...trackerTags, [id]: newTag });
      if (setTag) setTag(undefined);
      setNewTag("");
      const updatedAt = await updateMetadata(trackerId);
      if (trackerMeta) setTrackerMeta({ ...trackerMeta, updatedAt });
    },
    [
      tag,
      recordTags,
      setRecordTags,
      setTrackerTags,
      trackerTags,
      setTag,
      trackerId,
      trackerMeta,
      setTrackerMeta,
    ]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (tag && setTag && e.target.value.length === 0) {
      setTag(undefined);
    }
    setNewTag(e.target.value);
  };

  return (
    <div className={`relative flex gap-2 pb-3`}>
      <label
        className={`flex min-w-${
          tag ? 20 : 16
        } justify-start items-center text-xs font-semibold`}
      >
        {t(locale, `body.buttons.${tag ? "update" : "add"}`)}
      </label>
      <input
        id="tagInput"
        name="tagInput"
        type="text"
        value={newTag}
        className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 focus:outline-blue-300 rounded-md text-xs"
        placeholder={t(locale, `body.form.placeholders.newTag`)}
        onChange={(e) => handleChange(e)}
      />
      <IconButton
        title={`create new tag`}
        icon={
          !tag ? (
            <AddIcon className="w-5 h-5" />
          ) : (
            <UpdateIcon className="w-4 h-4" />
          )
        }
        value={newTag}
        handleClick={handleAddNewTag}
        customStyle="col-span-1 min-w-6 w-6 h-6 my-auto rounded-sm bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
        disabled={isDisabled || newTag.length === 0}
      />
      {isDisabled && (
        <p
          className={`absolute -bottom-1 col-span-6 text-xs text-red-600 my-auto`}
        >
          {t(locale, `body.form.tracker.typeDouble`)}
        </p>
      )}
    </div>
  );
};

export default FormNewTagBlock;
