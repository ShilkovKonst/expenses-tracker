"use client";
import { useState } from "react";
import FormNewTagBlock from "../../formComponents/FormNewTagBlock";
import SettingsTagsBlock from "./SettingsTagsBlock";
import { TagId } from "@/lib/types/brand";
import SettingsRenameTrackerBlock from "./SettingsRenameTrackerBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";

export type TagObj = { id: TagId; title: string };
const SettingsBlock = () => {
  const { locale } = useGlobal();
  const [tag, setTag] = useState<TagObj>();
  return (
    <>
      <div className="col-span-2">
        <SettingsRenameTrackerBlock />
      </div>
      <p className={`col-span-2 font-semibold text-xs text-center mx-auto`}>
        {t(locale, "body.personnalisation.descriptionTags")}
      </p>
      <div className="col-span-2">
        <FormNewTagBlock tag={tag} setTag={setTag} />
      </div>
      <SettingsTagsBlock tag={tag} setTag={setTag} />
    </>
  );
};

export default SettingsBlock;
