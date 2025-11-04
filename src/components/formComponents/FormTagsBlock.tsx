/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { Record, RecordTag } from "@/types/formTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TagButton from "../buttonComponents/TagButton";
import { t } from "@/locales/locale";
import LowLevelButton from "../buttonComponents/LowLevelButton";
import { AddIcon } from "@/lib/icons";
import FormInputBlock from "./FormInputBlock";
import { compare } from "@/lib/utils/compareHelper";

type FormTagsProps = {
  record: Record;
  setRecord: Dispatch<SetStateAction<Record | undefined>>;
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
  const { locale, recordTags, setRecordTags, selectedType } = useGlobal();

  const [currentTags, setCurrentTags] = useState<RecordTag[]>(
    record?.tags ?? []
  );
  const [filteredTags, setFilteredTags] = useState<RecordTag[]>(
    recordTags.filter((t) => t.tracker === selectedType.title)
  );
  const [newTag, setNewTag] = useState<RecordTag>({
    tracker: selectedType.title,
    title: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleAddClick = (tag: RecordTag) => {
    if (currentTags.every((t) => t.title !== tag.title)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleRemoveClick = (tag: RecordTag) => {
    setCurrentTags([...currentTags.filter((t) => t.title !== tag.title)]);
  };

  const handleAddNewTag = (newTag: RecordTag) => {
    setCurrentTags([...currentTags, newTag]);
    setRecordTags([...recordTags, newTag]);
    setNewTag({
      tracker: selectedType.title,
      title: "",
    });
  };

  useEffect(() => {
    setIsDisabled(
      recordTags.some(
        (t) => t.tracker === selectedType.title && t.title === newTag.title
      )
    );
  }, [newTag, recordTags]);

  useEffect(() => {
    setRecord({ ...record, tags: currentTags });
    let tags = recordTags;
    for (const tag of currentTags) {
      if (tags.some((t) => t === tag))
        tags = [...tags.filter((t) => t.title !== tag.title)];
    }
    setFilteredTags(tags.filter((t) => t.tracker === selectedType.title));

    if (
      currentTags.some((t) => t.title === "cash") &&
      currentTags.some((t) => t.title === "card")
    ) {
      setCurrentTags([...currentTags.filter((t) => t.title !== "card")]);
    }
    if (
      currentTags.some((t) => t.title === "card") &&
      currentTags.some((t) => t.title === "cash")
    ) {
      setCurrentTags([...currentTags.filter((t) => t.title !== "cash")]);
    }
  }, [currentTags]);

  return (
    <div className="col-span-2">
      <p className={`block font-semibold uppercase ${styleLabel}`}>
        {title} ({currentTags?.length})
      </p>
      <div
        className={`px-2 min-h-8 w-full border-2 border-blue-100 rounded-md rounded-b-none transition-colors duration-200 ease-in-out bg-white flex items-center gap-2`}
      >
        {currentTags.length !== 0 ? (
          currentTags?.map((tag, i) => (
            <TagButton
              handleClick={() => handleRemoveClick(tag)}
              key={i}
              tag={tag.title}
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
          {filteredTags
            .sort((a, b) => compare(a.title, b.title))
            .map((tag, i) => (
              <TagButton
                key={i}
                tag={tag.title}
                handleClick={() => handleAddClick(tag)}
                style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out"
              />
            ))}
        </div>
        <div className="grid grid-cols-6 gap-2">
          <FormInputBlock
            id="tagInput"
            name="tagInput"
            title=""
            value={newTag.title}
            handleChange={(e) =>
              setNewTag({ ...newTag, title: e.target.value })
            }
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
            disabled={isDisabled || newTag.title.length === 0}
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
