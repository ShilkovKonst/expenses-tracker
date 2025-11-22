type TagButtonProps = {
  tag: string |number;
  style: string;
  handleClick: () => void;
  disabled?: boolean;
  dataIndex?: string;
};

const TagButton: React.FC<TagButtonProps> = ({
  tag,
  style,
  handleClick,
  disabled,
  dataIndex,
}) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tag h-5 text-xs text-center font-semibold px-2 rounded-lg my-auto cursor-pointer ${style}`}
      disabled={disabled}
      data-index={dataIndex}
    >
      {tag}
    </button>
  );
};

export default TagButton;
