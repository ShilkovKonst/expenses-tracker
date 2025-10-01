type MonthButtonType = {
  title: string;
  style: string;
  isSubmit?: boolean;
  handleClick?: () => void;
  disabled: boolean;
};

const MonthButton: React.FC<MonthButtonType> = ({
  title,
  style,
  isSubmit,
  handleClick,
  disabled,
}) => {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={isSubmit ? () => {} : handleClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-md curson-pointer transition-colors duration-200 ease-in-out text-sm text-black font-semibold uppercase ${style}`}
    >
      {title}
    </button>
  );
};

export default MonthButton;
