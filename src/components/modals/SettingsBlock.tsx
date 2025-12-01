"use client";
import { CloseIcon } from "@/lib/icons";
import { UtilButton } from "../buttonComponents";
import FormNewTagBlock from "../formComponents/FormNewTagBlock";
import SettingsTagsBlock from "../settingsBlockComponents/SettingsTagsBlock";

type SettingsProps = {
  onClose: () => void;
};

const SettingsBlock = ({ onClose }: SettingsProps) => {
  return (
    <>
      <UtilButton
        icon={<CloseIcon className="h-7 w-7" />}
        title="close settings"
        customStyle="absolute top-3 right-3 col-span-2 md:col-span-1 h-9 w-9 bg-blue-400 hover:bg-blue-500"
        handleClick={onClose}
      />
      <div className="col-span-2">
        <FormNewTagBlock />
      </div>
      <SettingsTagsBlock />
    </>
  );
};

export default SettingsBlock;
