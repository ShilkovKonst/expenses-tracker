/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { AddIcon, ExpandIcon } from "@/lib/icons";
import { transformElement } from "@/lib/utils/transformElement";
import { Operation } from "@/types/formTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormTagsButton from "./FormTagsButton";

type FormTagsProps = {
  operation: Operation;
  // oldOperation: Operation;
  setOperation: Dispatch<SetStateAction<Operation>>;
  // isReset: boolean;
  // setIsReset: Dispatch<SetStateAction<boolean>>;
  title: string;
  styleLabel: string;
  styleInput: string;
};

const FormTagsBlock: React.FC<FormTagsProps> = ({
  operation,
  // oldOperation,
  setOperation,
  // isReset,
  // setIsReset,
  title,
  styleLabel,
}) => {
  const { operationTags } = useGlobal();

  const [currentTags, setCurrentTags] = useState<string[]>(
    operation?.tags ?? []
  );
  const [filteredTags, setFilteredTags] = useState<string[]>(
    operationTags.values().toArray()
  );

  const handleAddClick = (tag: string) => {
    if (currentTags.every((t) => t !== tag)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleRemoveClick = (tag: string) => {
    setCurrentTags([...currentTags.filter((t) => t !== tag)]);
  };

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
        className={`relative pl-2 pr-7 min-h-8 w-full border-2 border-blue-100 rounded-md transition-colors duration-200 ease-in-out bg-white flex items-center gap-2`}
      >
        {currentTags?.map((tag, i) => (
          <FormTagsButton
            handleClick={() => handleRemoveClick(tag)}
            key={i}
            tag={tag}
            style="bg-blue-300"
          />
        ))}
        <button
          type="button"
          data-type="operationTags"
          className="absolute top-0 right-0 h-7 w-7 bg-blue-400 hover:bg-blue-500 border-l-2 border-blue-100 transition-colors duration-200 ease-in-out rounded-r-sm cursor-pointer flex justify-center items-center"
          onClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
        >
          <ExpandIcon style="h-5 w-5" />
        </button>
      </div>
      <div
        id="operationTags"
        style={{ height: 0 }}
        className="mb-1 mt-2 w-full overflow-hidden px-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2"
      >
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
              t !== "online" && t !== "offline" && t !== "cash" && t !== "card"
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
      <div className="w-full border-t-2 border-blue-100" />
    </div>
  );
};

export default FormTagsBlock;
