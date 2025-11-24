/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { MonthRecord } from "@/lib/types/dataTypes";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { t } from "@/locales/locale";
import { AddIcon } from "@/lib/icons";
import FormInputBlock from "./FormInputBlock";
import { compare } from "@/lib/utils/compareHelper";
import { useTracker } from "@/context/TrackerContext";
import { createTag } from "@/idb/tagsCRUD";
import { LowLevelButton, TagButton } from "../buttonComponents";

type FormTagsProps = {
  record: MonthRecord;
  setRecord: Dispatch<SetStateAction<MonthRecord | undefined>>;
  title: string;
  styleLabel: string;
  styleInput: string;
};

const FormTagsBlock: React.FC<FormTagsProps> = ({
  record,
  setRecord,
  title,
  styleLabel,
}) => {
  const { locale } = useGlobal();
  const { trackerId, trackerTags, setTrackerTags } = useTracker();

  const [tags, setTags] = useState<Record<number, string>>();

  const [recordTags, setRecordTags] = useState<number[]>(record?.tags);
  const [newTag, setNewTag] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (trackerTags) {
      setTags({ ...trackerTags });
    }
  }, [trackerTags]);

  useEffect(() => {
    setNewTag("");
    if (
      tags &&
      trackerTags &&
      Object.values(tags).length !== Object.values(trackerTags).length
    )
      setTrackerTags({ ...tags });
  }, [tags]);

  useEffect(() => {
    setIsDisabled(Object.values(tags ?? []).some((t) => t === newTag));
  }, [newTag, tags]);

  useEffect(() => {
    setRecord({ ...record, tags: recordTags });
  }, [recordTags]);

  const handleAddClick = useCallback(
    (id: number) => {
      if (recordTags.every((t) => t !== id)) {
        setRecordTags([...recordTags, id]);
      }
    },
    [recordTags, setRecordTags]
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      setRecordTags([...recordTags.filter((t) => t !== id)]);
    },
    [recordTags, setRecordTags]
  );

  const handleAddNewTag = async (newTag: string) => {
    const newId = await createTag(trackerId, newTag);

    setRecordTags([...recordTags, newId]);
    setTags({ ...tags, [newId]: newTag });
  };

  const tagsEntries = useMemo(() => {
    if (!tags) return [];

    const tEntries = Object.entries(tags).sort((a, b) => compare(a[1], b[1]));
    return tEntries.filter((e) => recordTags.every((t) => t !== Number(e[0])));
  }, [tags, recordTags]);

  return (
    <div className="col-span-2">
      <p className={`block font-semibold uppercase ${styleLabel}`}>
        {title} ({recordTags?.length})
      </p>
      <div
        className={`px-2 min-h-8 w-full border-2 border-blue-100 rounded-md rounded-b-none transition-colors duration-200 ease-in-out bg-white flex items-center gap-2`}
      >
        {recordTags.length > 0 ? (
          recordTags.map((id, i) => (
            <TagButton
              key={i}
              id={id}
              tag={tags ? tags[id] ?? id : id}
              handleClick={handleRemoveClick}
              customStyle="bg-blue-300"
            />
          ))
        ) : (
          <p
            className={`block font-medium text-xs text-gray-500 ${styleLabel}`}
          >
            {t(locale, `body.form.operations.tagTitle`)}
          </p>
        )}
      </div>
      <div className="p-2 border-t-0 border-2 border-blue-100 rounded-md rounded-t-none">
        <div className="relative w-full overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2">
          {tagsEntries.map((entry, i) => (
            <TagButton
              key={i}
              id={Number(entry[0])}
              tag={entry[1]}
              handleClick={handleAddClick}
              customStyle="bg-blue-300 hover:bg-blue-400"
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2">
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
          <LowLevelButton
            icon={<AddIcon className="w-5 h-5" />}
            value={newTag}
            handleClick={handleAddNewTag}
            customStyle="col-span-2 w-6 h-6 my-auto rounded-sm"
            disabled={isDisabled || newTag.length === 0}
          />
          {isDisabled && (
            <p className="col-span-6 text-xs text-red-600 my-auto">
              {t(locale, `body.form.tracker.typeDouble`)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormTagsBlock;
