import { AddIcon } from "@/lib/icons";
import { FC } from "react";

type LowLevelButtonProps = {
  handleClick: () => void;
  style?: string;
  disabled?: boolean;
};

const LowLevelButton: FC<LowLevelButtonProps> = ({
  handleClick,
  style,
  disabled,
}) => {
  return (
    <button
      type="button"
      className={`${style} mr-auto h-7 w-7 rounded-sm cursor-pointer flex justify-center items-center 
      bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600
        transition-colors duration-200 ease-in-out`}
      onClick={handleClick}
      disabled={disabled}
    >
      <AddIcon style="h-5 w-5" />
    </button>
  );
};

export default LowLevelButton;
