"use client";
import { Operation } from "@/types/formTypes";
import FormInputBlock from "../../formComponents/FormInputBlock";
import TagButton from "../../buttonComponents/TagButton";
import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent as RMouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isEqual } from "@/lib/utils/equalizer";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";

type OperationFormBlockProps = {
  currentOperation: Operation;
  oldOperation: Operation | undefined;
  setCurrentOperation: Dispatch<SetStateAction<Operation>>;
  formId: string;
  handleUpdate: (
    e: RMouseEvent<HTMLButtonElement, MouseEvent>,
    isDelete: boolean
  ) => void;
};

const OperationFormBlock: React.FC<OperationFormBlockProps> = ({
  currentOperation,
  oldOperation,
  setCurrentOperation,
  formId,
  handleUpdate,
}) => {
  const { locale } = useGlobal();
  const [undoDisabled, setUndoDisabled] = useState<boolean>(true);

  useEffect(() => {
    setUndoDisabled(isEqual(currentOperation, oldOperation));
  }, [oldOperation, currentOperation]);

  const handleOperationChange = <K extends keyof Operation>(
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentOperation((operation) => ({
      ...operation,
      [name as K]: value as Operation[K],
    }));
  };

  const handleClear = (e: RMouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (oldOperation) setCurrentOperation(oldOperation);
  };

  const formFields = [
    {
      name: "type",
      title: t(locale, `body.form.operations.type`),
      id: "operationTypeInput" + currentOperation.id,
      value: currentOperation.type,
      type: "radio",
    },
    {
      name: "tags",
      title: t(locale, `body.form.operations.tags`),
      id: "operationTagsInput" + currentOperation.id,
      value: currentOperation.tags,
      type: "",
    },
    {
      name: "amount",
      title: t(locale, `body.form.operations.amount`),
      id: "operationAmountInput" + currentOperation.id,
      value: currentOperation.amount,
      type: "number",
    },
    {
      id: "operationDescInput" + currentOperation.id,
      name: "description",
      title: t(locale, `body.form.operations.description`),
      value: currentOperation.description,
      type: "text",
    },
  ];
  return (
    <form
      id={formId}
      style={{ height: 0 }}
      className="pl-2 grid grid-cols-2 gap-2 items-end transition-[height] duration-300 ease-in-out overflow-hidden "
    >
      {formFields.map((f, i) =>
        f.name === "type" ? (
          <FormRadioBlock
            key={i}
            id={f.id}
            labelRadio={f.title}
            name={f.name}
            // value={"f.value.toString()"}
            value={f.value?.toString()}
            handleChange={handleOperationChange}
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
        ) : f.name === "tags" ? (
          <FormTagsBlock
            key={i}
            name={f.name}
            title={f.title}
            id={f.id}
            value={f.value as string[]}
            handleChange={handleOperationChange}
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
        ) : (
          <FormInputBlock
            key={i}
            name={f.name}
            title={f.title}
            id={f.id}
            // value={"f.value.toString()"}
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
        title="&#10004;"
        style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1"
        handleClick={(e) => handleUpdate(e, false)}
      />
      <TagButton
        title="&#10006;"
        style="bg-red-300 hover:bg-red-400 border-red-400 cols-span-1 disabled:text-gray-600 disabled:bg-red-200 disabled:hover:bg-red-200 disabled:border-red-300"
        handleClick={(e) => handleClear(e)}
        disabled={undoDisabled}
      />
      <div className="col-span-2"></div>
    </form>
  );
};

export default OperationFormBlock;
