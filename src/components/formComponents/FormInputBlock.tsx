import { ChangeEvent } from "react";

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
}) => {
  return (
    <div className={`${outerStyle} `}>
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
        value={name === "amount" ? (value ? regexAmount(value) : "0") : value}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
};

export default FormInputBlock;

function regexAmount(amount: string) {
  const regex = /^0+/;
  const processedAmount = amount.replace(regex, "");
  return processedAmount.length === 0 ? "0" : processedAmount;
}
