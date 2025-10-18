import { ChangeEvent } from "react";

type FormRadioProps = {
  labelRadio: string;
  name: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormRadioBlock: React.FC<FormRadioProps> = ({
  id,
  name,
  value,
  labelRadio,
  styleLabel,
  styleInput,
  handleChange,
}) => {
  return (
    <div className={`col-span-1 grid grid-cols-1 gap-2`}>
      <p className={`${styleLabel} font-semibold uppercase flex-1`}>
        {labelRadio}
      </p>
      <div className="flex gap-2">
        {["income", "cost"].map((type, i) => (
          <div key={i} className="flex items-center">
            <input
              type="radio"
              id={`${id}-${type}`}
              value={type}
              name={name}
              checked={value === type}
              onChange={handleChange}
              className="input-radio"
              required
            />
            <label
              htmlFor={`${id}-${type}`}
              className={`${styleInput} text-xs font-medium text-gray-900 uppercase`}
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormRadioBlock;
