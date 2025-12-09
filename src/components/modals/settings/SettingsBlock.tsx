"use client";
import FormNewTagBlock from "../../formComponents/FormNewTagBlock";
import SettingsTagsBlock from "./SettingsTagsBlock";

const SettingsBlock = () => {
  return (
    <>
      <div className="col-span-2">
        <FormNewTagBlock />
      </div>
      <SettingsTagsBlock />
    </>
  );
};

export default SettingsBlock;
