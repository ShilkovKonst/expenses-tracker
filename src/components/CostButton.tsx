type CostButtonType = {
  title: string;
  style: string;
  dataType: string;
  dataUpdate: string;
  handleClick: () => void;
};

const CostButton: React.FC<CostButtonType> = ({
  title,
  style,
  dataType,
  dataUpdate,
  handleClick,
}) => {
  return (
    <button
      data-type={dataType}
      data-update={dataUpdate}
      type="button"
      onClick={handleClick}
      className={`px-3 py-1 ${style} transition-colors duration-200 ease-in-out rounded cursor-pointer`}
    >
      {title}
    </button>
  );
};

export default CostButton;
