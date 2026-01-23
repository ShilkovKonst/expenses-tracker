"use client";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { DeleteIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { compare } from "@/lib/utils/compareHelper";
import { IconButton, TextRoundedButton } from "../../buttonComponents";
import { useModal } from "@/context/ModalContext";
import { deleteTagByIdRecordsCleanup } from "@/idb/CRUD/tagsCRUD";
import { useTracker } from "@/context/TrackerContext";
import { TagObj } from "./SettingsBlock";
import { createTagId } from "@/lib/types/brand";

type SettingsTagsProps = {
  tag?: TagObj;
  setTag: Dispatch<SetStateAction<TagObj | undefined>>;
};
const SettingsTagsBlock = ({ tag, setTag }: SettingsTagsProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags } = useTracker();
  const { openModal } = useModal();

  const isDisabled = useMemo(() => (id: number) => id === tag?.id, [tag?.id]);

  const handleRemove = useCallback(
    (idx: number) => {
      const onDelete = async () => {
        await deleteTagByIdRecordsCleanup(trackerId, idx);
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
    [trackerTags, openModal, trackerId],
  );

  const tagsArray: TagObj[] | null = useMemo(
    () =>
      trackerTags &&
      Object.entries(trackerTags)
        .map((vals) => ({ id: createTagId(Number(vals[0])), title: vals[1] }))
        .sort((a, b) => compare(a.title, b.title)),
    [trackerTags],
  );

  return (
    <div className="col-span-2 w-full py-2 flex flex-wrap items-center gap-5 border-t-2 border-b-2 border-blue-100">
      {tagsArray &&
        tagsArray.map((tg, i) => (
          <div key={i} className="relative flex">
            <TextRoundedButton
              handleClick={() => setTag(tg)}
              title={`${t(locale, "body.buttons.update")} '${tg.title}'`}
              value={tg.title}
              id={tg.id}
              disabled={isDisabled(tg.id)}
              customStyle={`bg-blue-300 hover:bg-blue-400 disabled:bg-blue-400 disabled:hover:bg-blue-400 rounded-r-lg pr-8 h-7`}
            />
            <IconButton
              icon={<DeleteIcon className="h-5 w-5" />}
              value={String(tg.id)}
              title={`${t(locale, "body.buttons.delete")} '${tg.title}'`}
              customStyle="absolute top-0 right-0 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
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
