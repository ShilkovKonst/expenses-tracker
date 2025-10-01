"use client";
import {
  Dispatch,
  MouseEvent as ReactMouseEvent,
  SetStateAction,
  useState,
} from "react";
import TagButton from "./TagButton";
import { Locale, t } from "@/locales/locale";
import FormSelectBlock from "./FormSelectBlock";

type TagsBlockPropsType = {
  locale: Locale;
  selectedTag: string;
  setSelectedTag: Dispatch<SetStateAction<string>>;
  expenseTags: string[];
  setExpenseTags: Dispatch<SetStateAction<string[]>>;
};

const TagsBlock: React.FC<TagsBlockPropsType> = ({
  locale,
  selectedTag,
  setSelectedTag,
  expenseTags,
  setExpenseTags,
}) => {
  const [customTag, setCustomTag] = useState<string>("");
  const handleCustomTagChange = (custom: string) => {
    setCustomTag(custom);
  };

  const handleCustomTagAdd = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      const newTags = [...expenseTags, customTag.trim()];
      localStorage.setItem("expenseTags", JSON.stringify(newTags));
      setExpenseTags(newTags);
      setCustomTag("");
    }
  };

  const handleCustomTagRemove = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      if (expenseTags.includes(customTag.trim())) {
        const newTags = [...expenseTags.filter((t) => t !== customTag)];
        localStorage.setItem("expenseTags", JSON.stringify(newTags));
        setExpenseTags(newTags);
        setCustomTag("");
      } else {
        setCustomTag("");
      }
    }
  };
  return (
    <div>
      <p className="text-sm mb-2">{t(locale, `body.form.expensesTagTitle`)}</p>
      <div className="flex flex-col gap-2 justify-center items-start">
        <FormSelectBlock
          locale={locale}
          id="tagSelect"
          style="px-2 py-1 text-sm"
          value={selectedTag}
          options={expenseTags}
          withLabel={false}
          onChange={(e) => setSelectedTag(e.target.value)}
        />
        <div className="w-full flex justify-between gap-3 items-center">
          <input
            className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
            placeholder={t(locale, `body.form.expensesTagCustomTitle`)}
            type="text"
            value={customTag}
            onChange={(e) => handleCustomTagChange(e.target.value)}
          />
          <TagButton
            title="&#10004;"
            style="bg-green-200 hover:bg-green-300 border-green-300"
            handleClick={handleCustomTagAdd}
          />
          <TagButton
            title="&#10006;"
            style="bg-red-200 hover:bg-red-300 border-red-300"
            handleClick={handleCustomTagRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default TagsBlock;
