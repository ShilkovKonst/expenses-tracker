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
import { createTagId, TagId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { TagObj } from "../modals/settings/SettingsBlock";
import { formatDatetoMeta } from "@/lib/utils/dateParser";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";

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
    trackerTags,
    setTrackerTags,
    trackerMeta,
    setTrackerMeta,
  } = useTracker();
  const { addFlash } = useFlash();

  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    if (tag) setNewTag(tag.title);
  }, [tag]);

  const isDoubled = useMemo(
    () =>
      Object.values(trackerTags ?? [])
        .filter((t) => t !== tag?.title)
        .includes(newTag),
    [newTag, tag, trackerTags],
  );

  const isDisabled = useMemo(
    () =>
      Object.values(trackerTags ?? []).filter((t) => t === newTag).length > 0 ||
      newTag.length === 0,
    [newTag, trackerTags],
  );

  const handleAddNewTag = useCallback(
    async (newTag: string) => {
      try {
        let id;
        if (tag) {
          id = await updateTagById(trackerId, tag.id, newTag);
        } else {
          id = await createTag(trackerId, newTag);
        }
        if (trackerMeta) {
          const updatedAt = formatDatetoMeta(new Date());
          const newMeta: TrackerMeta = {
            id: trackerMeta?.id ?? trackerId,
            title: trackerMeta?.title ?? trackerId,
            createdAt: trackerMeta?.createdAt ?? updatedAt,
            updatedAt,
          };
          await updateMetadata(trackerId, newMeta);
          setTrackerMeta(newMeta);
        }
        if (recordTags && setRecordTags)
          setRecordTags([...recordTags, createTagId(id)]);
        setTrackerTags({ ...trackerTags, [id]: newTag });
        if (tag && setTag) setTag(undefined);
        setNewTag("");
        addFlash(
          "success",
          `${t(locale, "body.flash.newAdded", {
            entity: t(locale, "body.modal.deleteEntity.tag"),
          })} - ${newTag}`,
        );
      } catch (error) {
        addFlash("error", getErrorMessage(error, ""));
      }
    },
    [
      tag,
      trackerMeta,
      recordTags,
      setRecordTags,
      setTrackerTags,
      trackerTags,
      setTag,
      addFlash,
      locale,
      trackerId,
      setTrackerMeta,
    ],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (tag && setTag && e.target.value.length === 0) {
      setTag(undefined);
    }
    setNewTag(e.target.value);
  };

  return (
    <div className={`relative flex gap-2`}>
      <label
        className={`flex ${
          tag ? "min-w-20" : "min-w-16"
        } justify-start items-center text-xs font-semibold`}
      >
        {t(locale, `body.buttons.${tag ? "update" : "add"}`)}
      </label>
      <input
        id="tagInput"
        name="tagInput"
        type="text"
        title={isDoubled ? t(locale, `body.form.tracker.typeDouble`) : ""}
        value={newTag}
        className={`col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 focus:outline-0 ${
          isDoubled ? "focus:border-red-500" : "focus:border-blue-300"
        } rounded-md text-xs`}
        placeholder={t(locale, `body.form.placeholders.newTag`)}
        onChange={(e) => handleChange(e)}
      />
      <IconButton
        title={
          !tag
            ? t(locale, `body.buttons.add`)
            : t(locale, `body.buttons.update`)
        }
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
        disabled={isDisabled}
      />
    </div>
  );
};

export default FormNewTagBlock;
