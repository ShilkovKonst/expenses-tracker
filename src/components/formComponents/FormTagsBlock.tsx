/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { MonthRecord } from "@/types/formTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TagButton from "../buttonComponents/TagButton";
import { t } from "@/locales/locale";
import LowLevelButton from "../buttonComponents/LowLevelButton";
import { AddIcon } from "@/lib/icons";
import FormInputBlock from "./FormInputBlock";
import { compare } from "@/lib/utils/compareHelper";
import { useTracker } from "@/context/TrackerContext";

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
  const { trackerTags, setTrackerTags } = useTracker();

  const [tags, setTags] = useState<Record<string, string>>();

  const [recordTags, setRecordTags] = useState<string[]>(record?.tags);
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

  // useEffect(() => {
  //   console.log(record);
  // }, [record]);

  const handleAddClick = (id: string) => {
    if (recordTags.every((t) => t !== id)) {
      setRecordTags([...recordTags, id]);
    }
  };

  const handleRemoveClick = (id: string) => {
    setRecordTags([...recordTags.filter((t) => t !== id)]);
  };

  const handleAddNewTag = (newTag: string) => {
    setRecordTags([...recordTags, `t${Object.values(tags ?? []).length}`]);
    setTags({ ...tags, [`t${Object.values(tags ?? []).length}`]: newTag });
  };

  return (
    <div className="col-span-2">
      <p className={`block font-semibold uppercase ${styleLabel}`}>
        {title} ({recordTags?.length})
      </p>
      <div
        className={`px-2 min-h-8 w-full border-2 border-blue-100 rounded-md rounded-b-none transition-colors duration-200 ease-in-out bg-white flex items-center gap-2`}
      >
        {recordTags.length !== 0 ? (
          recordTags?.map((id, i) => (
            <TagButton
              handleClick={() => handleRemoveClick(id)}
              key={i}
              tag={tags ? tags[id] ?? id : id}
              style="bg-blue-300"
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
          {tags &&
            Object.entries(tags)
              .sort((a, b) => compare(a[1], b[1]))
              .map(
                (entry, i) =>
                  recordTags.every((t) => t !== entry[0]) && (
                    <TagButton
                      key={i}
                      tag={entry[1]}
                      handleClick={() => handleAddClick(entry[0])}
                      style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out"
                    />
                  )
              )}
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
            handleClick={() => handleAddNewTag(newTag)}
            style="col-span-2 rounded-sm w-6 h-6 my-auto"
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
