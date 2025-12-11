"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent } from "react";

type FormRadioProps = {
  labelRadio: string;
  name: string;
  outerStyle: string;
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
  outerStyle,
  labelRadio,
  styleLabel,
  styleInput,
  handleChange,
}) => {
  const { locale } = useGlobal();

  const radioId = (id: string, type: string) => `${id}-${type}`;
  return (
    <div
      className={`${outerStyle} flex gap-1 md:gap-3 justify-start items-center`}
    >
      <p className={`${styleLabel} font-semibold uppercase`}>{labelRadio}</p>
      <div className="w-full flex justify-evenly gap-1 md:gap-2">
        {["income", "cost"].map((type, i) => {
          const inputId = radioId(id, type);
          return (
            <div
              key={i}
              className={`flex items-center cursor-pointer ${
                type === "income" ? "order-1" : "order-3"
              }`}
              onClick={() => {
                if (value !== type) {
                  handleChange({
                    target: { name, value: type },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
            >
              <input
                type="radio"
                id={inputId}
                value={type}
                name={name}
                checked={value === type}
                readOnly
                required
              />
              <label
                htmlFor={inputId}
                className={`${styleInput} font-light text-black uppercase pointer-events-none`}
              >
                {`${t(locale, `body.form.labels.${type}`)}`}
              </label>
            </div>
          );
        })}
        <div className="h-auto border-l border-blue-300 order-2" />
      </div>
    </div>
  );
};

export default FormRadioBlock;
