"use client";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { DeleteIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { compare } from "@/lib/utils/compareHelper";
import { IconButton, TextRoundedButton } from "../../buttonComponents";
import { useModal } from "@/context/ModalContext";
import { deleteTagByIdRecordsCleanup, getAllTags } from "@/idb/CRUD/tagsCRUD";
import { useTracker } from "@/context/TrackerContext";
import { createTagId } from "@/lib/types/dataTypes";
import { getAllRecords } from "@/idb/CRUD/recordsCRUD";
import { populateYears } from "@/lib/utils/yearsTransformer";
import { TagObj } from "./SettingsBlock";

type SettingsTagsProps = {
  tag?: TagObj;
  setTag: Dispatch<SetStateAction<TagObj | undefined>>;
};
const SettingsTagsBlock = ({ tag, setTag }: SettingsTagsProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags, setTrackerTags, setTrackerYears } =
    useTracker();
  const { openModal } = useModal();

  const isDisabled = useMemo(
    () => (id: number) => {
      console.log(id, tag?.id);
      return id === tag?.id;
    },
    [tag?.id]
  );

  const handleRemove = useCallback(
    (idx: number) => {
      const onDelete = async () => {
        await deleteTagByIdRecordsCleanup(trackerId, idx);
        const tags = await getAllTags(trackerId);
        setTrackerTags(tags);
        const records = await getAllRecords(trackerId);
        const years = populateYears(records);
        setTrackerYears(years);
        return { updatedAt: "", message: "" };
      };
      if (trackerTags)
        openModal("delete", {
          entityType: "tag",
          entity: {
            id: createTagId(idx),
            title: trackerTags[createTagId(idx)],
          },
          onConfirm: onDelete,
        });
    },
    [trackerTags, openModal, trackerId, setTrackerTags, setTrackerYears]
  );

  const tagsArray: TagObj[] | null = useMemo(
    () =>
      trackerTags &&
      Object.entries(trackerTags)
        .map((vals) => ({ id: createTagId(Number(vals[0])), title: vals[1] }))
        .sort((a, b) => compare(a.title, b.title)),
    [trackerTags]
  );

  return (
    <div className="col-span-2 w-full py-2 flex flex-wrap items-center gap-6 border-t-2 border-b-2 border-blue-100">
      {tagsArray &&
        tagsArray.map((tg, i) => (
          <div key={i} className="relative flex">
            <TextRoundedButton
              handleClick={() => setTag(tg)}
              title={`${t(locale, "body.buttons.update")} '${tg.title}'`}
              value={tg.title}
              id={tg.id}
              disabled={isDisabled(tg.id)}
              customStyle={`bg-blue-300 hover:bg-blue-400 disabled:bg-blue-400 disabled:hover:bg-blue-400 pr-6 h-7 rounded-r-none`}
            />
            <IconButton
              icon={<DeleteIcon className="h-5 w-5" />}
              value={String(tg.id)}
              title={`${t(locale, "body.buttons.delete")} '${tg.title}'`}
              customStyle="absolute top-0 -right-3 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
              handleClick={() => handleRemove(tg.id)}
            />
          </div>
        ))}
      {(!tagsArray || tagsArray.length === 0) && (
        <p className={`max-w-3/4 block font-medium text-xs`}>
          {t(locale, `body.form.placeholders.tagsListEmpty`)}
        </p>
      )}
    </div>
  );
};

export default SettingsTagsBlock;
