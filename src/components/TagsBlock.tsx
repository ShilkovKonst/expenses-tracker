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
import { TagType } from "@/types/formTypes";
import CostButton from "./CostButton";
import { transformElement } from "@/lib/utils/transformElement";
import { AddTag } from "@/lib/icons";

type TagsBlockPropsType = {
  locale: Locale;
  selectedTag: TagType;
  setSelectedTag: Dispatch<SetStateAction<TagType>>;
  costTags: TagType[];
  setCostTags: Dispatch<SetStateAction<TagType[]>>;
};

const TagsBlock: React.FC<TagsBlockPropsType> = ({
  locale,
  selectedTag,
  setSelectedTag,
  costTags,
  setCostTags,
}) => {
  const [customTag, setCustomTag] = useState<TagType>({
    type: "",
    withBudget: false,
  });
  const handleCustomTagChange = (custom: string) => {
    setCustomTag({ ...customTag, type: custom.trim() });
  };

  const handleCustomTagAdd = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      const newTags = [...costTags, customTag];
      localStorage.setItem("costTags", JSON.stringify(newTags));
      setCostTags(newTags);
      setCustomTag({ type: "" });
    }
  };

  const handleCustomTagRemove = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      if (costTags.find((t) => t.type === customTag.type.trim())) {
        const newTags = [...costTags.filter((t) => t !== customTag)];
        localStorage.setItem("costTags", JSON.stringify(newTags));
        setCostTags(newTags);
        setCustomTag({ type: "" });
      } else {
        setCustomTag({ type: "" });
      }
    }
  };
  return (
    <div>
      <h3 className="text-sm my-2">{t(locale, `body.form.costsTagTitle`)}</h3>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 justify-between items-center">
        <FormSelectBlock
          locale={locale}
          id="tagSelect"
          style="px-2 py-2 text-sm"
          value={selectedTag.type}
          options={costTags.map((t) => t.type)}
          withLabel={false}
          onChange={(e) => setSelectedTag({ type: e.target.value })}
        />
        <CostButton
          icon={<AddTag style="h-7 w-7" />}
          dataType="form-custom-tag"
          dataUpdate=""
          title={t(locale, `body.form.costsTagFormTitle`)}
          style="bg-blue-400 hover:bg-blue-500 col-span-2 md:col-span-1 h-9 w-9"
          handleClick={(e) =>
            transformElement(e.target as HTMLElement, "data-type")
          }
        />
        <div className="col-span-6 border-b-2 border-blue-100 mt-2" />
        <form
          style={{ height: 0 }}
          id="form-custom-tag"
          className="w-full gap-3 col-span-4 md:col-span-3 overflow-hidden transition-[height] duration-300 ease-in-out grid grid-cols-4"
        >
          {/* <div className="  col-span-4" /> */}
          <input
            className="w-full px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white col-span-4"
            placeholder={t(locale, `body.form.costsTagCustomTitle`)}
            type="text"
            value={customTag.type}
            onChange={(e) => handleCustomTagChange(e.target.value)}
          />
          <div
            title={t(locale, `body.modal.checkBoxTip`)}
            className=" col-span-4 flex justify-start items-center gap-2"
          >
            <input
              id="checkInput"
              type="checkbox"
              className="col-span-1"
              checked={!!customTag.withBudget}
              onChange={() => {
                console.log(customTag);
                setCustomTag({
                  ...customTag,
                  withBudget: customTag.withBudget
                    ? !customTag.withBudget
                    : true,
                });
              }}
            />
            <label htmlFor="checkInput" className="col-span-2">
              {} With budget?
            </label>
          </div>
          <TagButton
            title="&#10004;"
            style="bg-green-200 hover:bg-green-300 border-green-300 col-span-2"
            handleClick={handleCustomTagAdd}
          />
          <TagButton
            title="&#10006;"
            style="bg-red-200 hover:bg-red-300 border-red-300 col-span-2"
            handleClick={handleCustomTagRemove}
          />
        </form>
        <div className="col-span-6 border-t-2 border-blue-100 mb-2" />
      </div>
    </div>
  );
};

export default TagsBlock;
