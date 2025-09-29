type MonthButtonType = {
  title: string;
  style: string;
  isSubmit?: boolean;
  handleClick?: () => void;
};

const MonthButton: React.FC<MonthButtonType> = ({
  title,
  style,
  isSubmit,
  handleClick,
}) => {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={isSubmit ? () => {} : handleClick}
      className={`px-6 py-3 rounded-md curson-pointer transition-colors duration-200 ease-in-out text-sm text-white font-semibold uppercase ${style}`}
    >
      {title}
    </button>
  );
};

export default MonthButton;
