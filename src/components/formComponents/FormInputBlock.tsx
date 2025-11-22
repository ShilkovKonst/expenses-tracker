import { sanitizeAmountExpression } from "@/lib/utils/amountHelper";
import { ChangeEvent, MouseEvent as RME } from "react";

type FormInputProps = {
  name: string;
  title: string;
  outerStyle: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string;
  disabled: boolean;
  required: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  withoutLabel?: boolean;
  isCalcMode?: boolean;
  handleCalc?: (value: string) => void;
};

const FormInputBlock: React.FC<FormInputProps> = ({
  name,
  title,
  outerStyle,
  styleLabel,
  styleInput,
  id,
  value,
  disabled,
  required,
  handleChange,
  withoutLabel,
  isCalcMode,
  handleCalc,
}) => {
  const handleClick = (e: RME<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (handleCalc) handleCalc(value);
  };

  return (
    <div className={`${outerStyle} relative`}>
      {!withoutLabel && (
        <label
          className={`block font-semibold uppercase ${styleLabel}`}
          htmlFor={id}
        >
          {title}
        </label>
      )}
      <input
        id={id}
        className={`w-full border-2 border-blue-100 focus:outline-blue-300 rounded-md text-sm bg-white pl-2 ${styleInput}`}
        type={"text"}
        name={name}
        value={name === "amount" ? sanitizeAmountExpression(value) : value}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        required={required}
      />
      {isCalcMode && handleCalc && (
        <button
          onClick={handleClick}
          className="absolute cursor-pointer top-2 right-1 rounded-sm h-4 w-4 bg-green-500 text-center flex justify-center items-center"
        >
          <p>=</p>
        </button>
      )}
    </div>
  );
};

export default FormInputBlock;
