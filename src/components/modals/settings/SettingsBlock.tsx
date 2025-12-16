"use client";
import { useState } from "react";
import FormNewTagBlock from "../../formComponents/FormNewTagBlock";
import SettingsTagsBlock from "./SettingsTagsBlock";
import { TagId } from "@/lib/types/brand";

export type TagObj = { id: TagId; title: string };
const SettingsBlock = () => {
  const [tag, setTag] = useState<TagObj>();
  return (
    <>
      <div className="col-span-2">
        <FormNewTagBlock tag={tag} setTag={setTag} />
      </div>
      <SettingsTagsBlock tag={tag} setTag={setTag} />
    </>
  );
};

export default SettingsBlock;
