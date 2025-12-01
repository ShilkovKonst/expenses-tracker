"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import FormInputBlock from "./FormInputBlock";
import { IconButton } from "../buttonComponents";
import { AddIcon } from "@/lib/icons";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { createTag } from "@/idb/CRUD/tagsCRUD";

type FormNewTagProps = {
  recordTags?: number[];
  setRecordTags?: Dispatch<SetStateAction<number[]>>;
};

const FormNewTagBlock = ({ recordTags, setRecordTags }: FormNewTagProps) => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags, setTrackerTags } = useTracker();

  const [newTag, setNewTag] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsDisabled(Object.values(trackerTags ?? []).some((t) => t === newTag));
  }, [newTag, trackerTags]);

  const handleAddNewTag = useCallback(
    async (newTag: string) => {
      const newId = await createTag(trackerId, newTag);
      if (recordTags && setRecordTags) setRecordTags([...recordTags, newId]);
      setTrackerTags({ ...trackerTags, [newId]: newTag });
      setNewTag("");
    },
    [trackerId, setRecordTags, recordTags, setTrackerTags, trackerTags]
  );

  return (
    <div className={`grid grid-cols-6 gap-2`}>
      <FormInputBlock
        id="tagInput"
        name="tagInput"
        title=""
        value={newTag}
        handleChange={(e) => setNewTag(e.target.value)}
        outerStyle="col-span-4"
        styleLabel=""
        styleInput="focus:outline-blue-300"
        withoutLabel={true}
        required={false}
        disabled={false}
      />
      <IconButton
        title={`create new tag`}
        icon={<AddIcon className="w-5 h-5" />}
        value={newTag}
        handleClick={handleAddNewTag}
        customStyle="col-span-2 w-6 h-6 my-auto rounded-sm bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600"
        disabled={isDisabled || newTag.length === 0}
      />
      {isDisabled && (
        <p className="col-span-6 text-xs text-red-600 my-auto">
          {t(locale, `body.form.tracker.typeDouble`)}
        </p>
      )}
    </div>
  );
};

export default FormNewTagBlock;
