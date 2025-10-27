import { FC, ReactNode } from "react";

type LowLevelButtonProps = {
  icon: ReactNode;
  handleClick: () => void;
  style?: string;
  disabled?: boolean;
};

const LowLevelButton: FC<LowLevelButtonProps> = ({
  icon,
  handleClick,
  style,
  disabled,
}) => {
  return (
    <button
      type="button"
      className={`mr-auto h-7 w-7 cursor-pointer flex justify-center items-center bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600 transition-colors duration-200 ease-in-out ${style}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default LowLevelButton;
