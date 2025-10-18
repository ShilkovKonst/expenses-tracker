/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { AddIcon } from "@/lib/icons";
import { Operation } from "@/types/formTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormTagsButton from "./FormTagsButton";
import { t } from "@/locales/locale";

type FormTagsProps = {
  operation: Operation;
  setOperation: Dispatch<SetStateAction<Operation | undefined>>;
  title: string;
  styleLabel: string;
  styleInput: string;
};

const FormTagsBlock: React.FC<FormTagsProps> = ({
  operation,
  setOperation,
  title,
  styleLabel,
}) => {
  const { locale, operationTags, setOperationTags } = useGlobal();

  const [currentTags, setCurrentTags] = useState<string[]>(
    operation?.tags ?? []
  );
  const [filteredTags, setFilteredTags] = useState<string[]>(
    operationTags.values().toArray()
  );
  const [newTag, setNewTag] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleAddClick = (tag: string) => {
    if (currentTags.every((t) => t !== tag)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleRemoveClick = (tag: string) => {
    setCurrentTags([...currentTags.filter((t) => t !== tag)]);
  };

  const handleAddNewTag = (newTag: string) => {
    setCurrentTags([...currentTags, newTag]);
    setOperationTags(new Set([...operationTags, newTag]));
    setNewTag("");
  };

  useEffect(() => {
    setIsDisabled(operationTags.has(newTag));
  }, [newTag, operationTags]);

  useEffect(() => {
    setOperation({ ...operation, tags: currentTags });
    let tags = operationTags.values().toArray();
    for (const tag of currentTags) {
      if (tags.some((t) => t === tag))
        tags = [...tags.filter((t) => t !== tag)];
    }
    setFilteredTags(tags);

    if (
      currentTags.some((t) => t === "cash") &&
      currentTags.some((t) => t === "card")
    ) {
      setCurrentTags([...currentTags.filter((t) => t !== "card")]);
    }
    if (
      currentTags.some((t) => t === "card") &&
      currentTags.some((t) => t === "cash")
    ) {
      setCurrentTags([...currentTags.filter((t) => t !== "cash")]);
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
        {currentTags?.map((tag, i) => (
          <FormTagsButton
            handleClick={() => handleRemoveClick(tag)}
            key={i}
            tag={tag}
            style="bg-blue-300"
          />
        ))}
      </div>
      <div className="p-2 border-t-0 border-2 border-blue-100 rounded-md rounded-t-none">
        <div className="relative w-full overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2">
          {currentTags.every((t) => t !== "online" && t !== "offline") &&
            filteredTags
              .filter((t) => t === "online" || t === "offline")
              .map((tag, i) => (
                <FormTagsButton
                  key={i}
                  tag={tag}
                  handleClick={() => handleAddClick(tag)}
                  style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out"
                />
              ))}
          {currentTags.every((t) => t !== "cash" && t !== "card") &&
            filteredTags
              .filter((t) => t === "card" || t === "cash")
              .map((tag, i) => (
                <FormTagsButton
                  key={i}
                  tag={tag}
                  handleClick={() => handleAddClick(tag)}
                  style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out"
                />
              ))}
          {filteredTags
            .filter(
              (t) =>
                t !== "online" &&
                t !== "offline" &&
                t !== "cash" &&
                t !== "card"
            )
            .map((tag, i) => (
              <FormTagsButton
                key={i}
                tag={tag}
                handleClick={() => handleAddClick(tag)}
                style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out"
              />
            ))}
        </div>
        <div className="grid grid-cols-6 gap-2">
          <input
            className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-xs"
            placeholder={t(locale, `body.form.data.typeCustomTitle`)}
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          {isDisabled ? (
            <p className="col-span-2 text-xs text-red-600 my-auto">
              {t(locale, `body.form.data.typeDouble`)}
            </p>
          ) : (
            <button
              type="button"
              className="col-span-2 ml-auto h-7 w-7 bg-green-400 hover:bg-green-500  transition-colors duration-200 ease-in-out rounded-sm cursor-pointer flex justify-center items-center"
              onClick={() => handleAddNewTag(newTag)}
              disabled={!newTag}
            >
              <AddIcon style="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormTagsBlock;
