type TagButtonProps = {
  tag: string;
  style: string;
  handleClick: () => void;
  disabled?: boolean;
};

const TagButton: React.FC<TagButtonProps> = ({
  tag,
  style,
  handleClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tag h-5 text-xs text-center font-semibold px-2 rounded-lg my-auto cursor-pointer ${style}`}
      disabled={disabled}
    >
      {tag}
    </button>
  );
};

export default TagButton;
