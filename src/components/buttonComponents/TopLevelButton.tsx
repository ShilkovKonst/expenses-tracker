import { MouseEvent as ReactMouseEvent, ReactNode } from "react";

type TopLevelButtonProps = {
  icon: ReactNode | string;
  title: string;
  style: string;
  dataType?: string;
  dataUpdate?: string;
  handleClick:
    | (() => void)
    | ((e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void);
  disabled?: boolean;
  isExpand?: boolean;
};

const TopLevelButton: React.FC<TopLevelButtonProps> = ({
  icon,
  title,
  style,
  dataType,
  dataUpdate,
  handleClick,
  disabled,
}) => {
  return (
    <button
      title={title}
      data-type={dataType}
      data-update={dataUpdate}
      type="button"
      onClick={handleClick}
      className={`p-1 ${style} transition-colors duration-200 ease-in-out rounded cursor-pointer flex justify-center items-center`}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default TopLevelButton;
