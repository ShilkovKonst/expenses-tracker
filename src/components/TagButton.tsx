import { MouseEvent as ReactMouseEvent } from "react";

type TagButtonType = {
  style: string;
  title: string;
  id?: string;
  handleClick: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TagButton: React.FC<TagButtonType> = ({
  style,
  title,
  id,
  handleClick,
}) => {
  return (
    <button
      id={id ?? ""}
      className={`text-sm font-bold px-2 py-1 ${style} border-2 transition-colors duration-300 ease-in-out rounded`}
      onClick={(e) => handleClick(e)}
    >
      {title}
    </button>
  );
};

export default TagButton;
