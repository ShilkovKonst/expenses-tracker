import { MouseEvent as ReactMouseEvent } from "react";

type TagButtonType = {
  style: string;
  title: string;
  handleClick: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TagButton: React.FC<TagButtonType> = ({ style, title, handleClick }) => {
  return (
    <button
      className={`text-lg font-bold px-2 py-1 ${style} border-2 transition-colors duration-200 ease-in-out rounded`}
      onClick={(e) => handleClick(e)}
    >
      {title}
    </button>
  );
};

export default TagButton;
