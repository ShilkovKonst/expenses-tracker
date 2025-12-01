"use client";
import { useCallback, useMemo } from "react";
import { DeleteIcon } from "@/lib/icons";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { compare } from "@/lib/utils/compareHelper";
import { IconButton, TextRoundedButton } from "../buttonComponents";
import { useModal } from "@/context/ModalContext";
import { deleteTagById, getAllTags } from "@/idb/CRUD/tagsCRUD";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { useTracker } from "@/context/TrackerContext";

const SettingsTagsBlock = () => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags, setTrackerTags } = useTracker();
  const { openModal } = useModal();

  const handleRemove = useCallback(
    (idx: number) => {
      const onDelete = async () => {
        await deleteTagById(trackerId, idx);
        const updatedAt = await updateMetadata(trackerId);
        const tags = await getAllTags(trackerId);
        setTrackerTags(tags);
        return { updatedAt, message: "" };
      };
      if (trackerTags)
        openModal("delete", {
          entityType: "tag",
          entity: { id: idx, title: trackerTags[idx] },
          onConfirm: onDelete,
        });
    },
    [trackerTags, openModal, trackerId, setTrackerTags]
  );

  const tagsArray = useMemo(
    () =>
      trackerTags &&
      Object.entries(trackerTags).sort((a, b) => compare(a[1], b[1])),
    [trackerTags]
  );

  return (
    <div className="col-span-2 w-full py-2 flex flex-wrap items-center gap-6 border-t-2 border-b-2 border-blue-100">
      {tagsArray &&
        tagsArray.map((tag, i) => (
          <div key={i} className="relative flex">
            <TextRoundedButton
              handleClick={() => console.log("create update tag logic")}
              title={`update tag ${tag[0]} ${tag[1]}`}
              value={tag[1]}
              id={Number(tag[0])}
              customStyle={`bg-blue-300 disabled:bg-blue-400 disabled:hover:bg-blue-400 pr-6 h-7 rounded-r-none`}
            />
            <IconButton
              icon={<DeleteIcon className="h-5 w-5" />}
              value={tag[0]}
              title={`open modal to delete tag ${tag[0]} ${tag[1]}`}
              customStyle="absolute top-0 -right-3 rounded-lg h-7 w-7 bg-red-400 hover:bg-red-500"
              handleClick={() => handleRemove(Number(tag[0]))}
            />
          </div>
        ))}
      {!tagsArray ||
        (tagsArray.length === 0 && (
          <p className={`max-w-3/4 block font-medium text-xs text-gray-500`}>
            {t(locale, `body.form.operations.tagTitleEmpty`)}
          </p>
        ))}
    </div>
  );
};

export default SettingsTagsBlock;
