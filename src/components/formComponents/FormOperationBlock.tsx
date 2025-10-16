"use client";
import { Operation } from "@/types/formTypes";
import FormInputBlock from "./FormInputBlock";
import TagButton from "../buttonComponents/TagButton";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent, useState } from "react";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";

type FormOperationBlockProps = {
  operation: Operation;
  handleUpdate: (operation: Operation, isDelete: boolean) => void;
  handleClear: () => void;
};

const FormOperationBlock: React.FC<FormOperationBlockProps> = ({
  operation,
  handleUpdate,
  handleClear,
}) => {
  const { locale } = useGlobal();

  const [currentOperation, setCurrentOperation] =
    useState<Operation>(operation);

  const handleOperationChange = <K extends keyof Operation>(
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (currentOperation)
      setCurrentOperation({
        ...currentOperation,
        [name as K]: value as Operation[K],
      });
  };

  const formFields = [
    {
      name: "type",
      title: t(locale, `body.form.operations.type`),
      id: "operationTypeInput" + currentOperation?.id,
      value: currentOperation?.type,
      type: "radio",
    },
    {
      name: "tags",
      title: t(locale, `body.form.operations.labelTags`),
      id: "operationTagsInput" + currentOperation?.id,
      value: currentOperation,
      type: "",
    },
    {
      name: "amount",
      title: t(locale, `body.form.operations.amount`),
      id: "operationAmountInput" + currentOperation?.id,
      value: currentOperation?.amount,
      type: "number",
    },
    {
      id: "operationDescInput" + currentOperation?.id,
      name: "description",
      title: t(locale, `body.form.operations.description`),
      value: currentOperation?.description,
      type: "text",
    },
  ];
  return (
    <form className="bg-blue-50 p-3 rounded-lg grid grid-cols-2 gap-2 items-end transition-[height] duration-300 ease-in-out overflow-hidden z-100">
      {formFields.map((f, i) =>
        f.name === "type" ? (
          <FormRadioBlock
            key={i}
            id={f.id}
            labelRadio={f.title}
            name={f.name}
            value={f.value?.toString()}
            handleChange={handleOperationChange}
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
        ) : f.name === "tags" ? (
          <FormTagsBlock
            key={i}
            title={f.title}
            operation={currentOperation}
            setOperation={setCurrentOperation}
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
        ) : (
          <FormInputBlock
            key={i}
            name={f.name}
            title={f.title}
            id={f.id}
            value={f.value?.toString()}
            handleChange={handleOperationChange}
            type={f.type as "number" | "text"}
            disabled={false}
            required={true}
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
        )
      )}
      <TagButton
        title={t(locale, "body.modal.labelConfirm")}
        style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1"
        handleClick={() => handleUpdate(currentOperation, false)}
      />
      <TagButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-red-300 hover:bg-red-400 border-red-400 cols-span-1 disabled:text-gray-600 disabled:bg-red-200 disabled:hover:bg-red-200 disabled:border-red-300"
        handleClick={handleClear}
      />
      <div className="col-span-2"></div>
    </form>
  );
};

export default FormOperationBlock;
