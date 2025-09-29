type CostButtonType = {
  title: string;
  style: string;
  handleClick: () => void;
};

const CostButton: React.FC<CostButtonType> = ({
  title,
  style,
  handleClick,
}) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`mt-2 px-3 py-1 ${style} transition-colors duration-200 ease-in-out rounded`}
    >
      {title}
    </button>
  );
};

export default CostButton;
