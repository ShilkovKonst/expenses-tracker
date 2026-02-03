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

const FormAmountBlock: React.FC<FormInputProps> = ({
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
        className={`w-full px-2 py-1 border-2 bg-white border-blue-100 focus:outline-0 focus:border-blue-300 rounded-md text-xs ${styleInput}`}
        type={"text"}
        placeholder={withoutLabel && title ? title : ""}
        name={name}
        value={sanitizeAmountExpression(value)}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        required={required}
      />
      {isCalcMode && handleCalc && (
        <button
          onClick={handleClick}
          className="absolute cursor-pointer top-2.25 right-0.5 rounded-r-sm h-6 w-6 bg-blue-300 font-bold text-base text-center flex justify-center items-center"
        >
          <p className="my-auto">=</p>
        </button>
      )}
    </div>
  );
};

export default FormAmountBlock;
