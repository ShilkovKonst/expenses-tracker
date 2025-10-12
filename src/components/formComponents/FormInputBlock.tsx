import { ChangeEvent } from "react";

type FormInputProps = {
  name: string;
  title: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string;
  type: "text" | "number";
  disabled: boolean;
  required: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormInputBlock: React.FC<FormInputProps> = ({
  name,
  title,
  styleLabel,
  styleInput,
  id,
  value,
  type,
  disabled,
  required,
  handleChange,
}) => {
  return (
    <div className={`${name === "description" ? "col-span-2" : "col-span-1"} `}>
      <label
        className={`block font-semibold uppercase ${styleLabel}`}
        htmlFor={id}
      >
        {title}
      </label>
      <input
        id={id}
        className={`w-full border-2 border-blue-100 rounded-md transition-colors duration-200 ease-in-out bg-white ${styleInput}`}
        type={type}
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
