import { ChangeEvent } from "react";

type FormInputPropsType = {
  title: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string | number;
  type: "text" | "number";
  disabled: boolean;
  required: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormInputBlock: React.FC<FormInputPropsType> = ({
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
    <div className="col-span-2">
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
        value={value}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        required={required}
      />
    </div>
  );
};

export default FormInputBlock;
