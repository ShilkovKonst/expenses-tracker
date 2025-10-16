import { MouseEvent as ReactMouseEvent } from "react";

type TagButtonType = {
  style: string;
  title: string;
  id?: string;
  handleClick: () => void;
  disabled?: boolean;
};

const TagButton: React.FC<TagButtonType> = ({
  style,
  title,
  id,
  handleClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      id={id ?? ""}
      className={`text-sm font-bold px-2 py-1 ${style} border-2 transition-colors duration-300 ease-in-out rounded`}
      onClick={handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default TagButton;
