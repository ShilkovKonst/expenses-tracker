type FormTagsButtonProps = {
  tag: string;
  style: string;
  handleClick: () => void;
};

const FormTagsButton: React.FC<FormTagsButtonProps> = ({
  tag,
  style,
  handleClick,
}) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`h-5 text-xs text-center font-semibold px-2 rounded-lg my-auto cursor-pointer ${style}`}
    >
      {tag}
    </button>
  );
};

export default FormTagsButton;
