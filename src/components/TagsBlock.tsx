/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent as ReactMouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import TagButton from "./TagButton";
import { t } from "@/locales/locale";
import FormSelectBlock from "./FormSelectBlock";
import { TagType } from "@/types/formTypes";
import CostButton from "./CostButton";
import { transformElement } from "@/lib/utils/transformElement";
import { AddTag } from "@/lib/icons";
import { useGlobal } from "@/app/context/GlobalContext";

type TagsBlockPropsType = {
  costTags: TagType[];
  setCostTags: Dispatch<SetStateAction<TagType[]>>;
};

const TagsBlock: React.FC<TagsBlockPropsType> = ({ costTags, setCostTags }) => {
  const { locale, selectedTag, setSelectedTag } = useGlobal();
  const [customTag, setCustomTag] = useState<TagType>({
    id: 0,
    type: "",
    withBudget: false,
  });
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (customTag.id === 0) setCustomTag({ ...customTag, id: costTags.length });
  }, [costTags]);

  const handleCustomTagChange = (custom: string) => {
    setCustomTag({ ...customTag, type: custom.trim() });
    if (costTags.some((t) => t.type === custom)) {
      setIsDisabled(true);
    } else if (isDisabled) {
      setIsDisabled(false);
    }
  };

  const handleCustomTagAdd = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      const newTags = [...costTags, customTag];
      localStorage.setItem("expenseTags", JSON.stringify(newTags));
      setCostTags(newTags);
      setCustomTag({ id: newTags.length, type: "", withBudget: false });
    }
  };

  const handleCustomTagRemove = (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (customTag) {
      if (costTags.find((t) => t.type === customTag.type.trim())) {
        const newTags = [...costTags.filter((t) => t !== customTag)];
        localStorage.setItem("expenseTags", JSON.stringify(newTags));
        setCostTags(newTags);
        setCustomTag({ id: newTags.length, type: "", withBudget: false });
      } else {
        setCustomTag({ ...customTag, type: "", withBudget: false });
      }
    }
  };

  const handleSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const tag = costTags.find((t) => t.type === e.target.value);
    if (tag) setSelectedTag(tag);
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
          onChange={(e) => handleSelectTag(e)}
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
          <div className="w-full col-span-4 grid grid-cols-2 gap-2">
            <input
              className="w-full px-2 py-1 border-2 bg-white border-blue-100 rounded-md text-sm"
              placeholder={t(locale, `body.form.costsTagCustomTitle`)}
              type="text"
              value={customTag.type}
              onChange={(e) => handleCustomTagChange(e.target.value)}
            />
            {isDisabled && (
              <p className="text-xs text-red-600 my-auto">
                {t(locale, `body.form.costsTagDouble`)}
              </p>
            )}
          </div>
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
            style={`border-green-300 col-span-2 ${
              isDisabled
                ? "bg-green-100 text-gray-500"
                : "bg-green-200 hover:bg-green-300 cursor-pointer"
            }`}
            handleClick={handleCustomTagAdd}
            disabled={isDisabled}
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
