"use client";
import { Record } from "@/types/formTypes";
import FormInputBlock from "./FormInputBlock";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent, useEffect, useState } from "react";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import { useModal } from "@/context/ModalContext";
import { MONTHS } from "@/lib/constants";

type FormRecordBlockProps = {
  handleUpdate: (operation: Record, isDelete: boolean) => void;
  handleClear: () => void;
};

const FormRecordBlock: React.FC<FormRecordBlockProps> = ({
  handleUpdate,
  handleClear,
}) => {
  const { locale } = useGlobal();
  const { formModalBody } = useModal();

  const [currentRecord, setCurrentRecord] = useState<Record | undefined>(
    undefined
  );

  const handleOperationChange = <K extends keyof Record>(
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (currentRecord)
      setCurrentRecord({
        ...currentRecord,
        [name as K]: value as Record[K],
      });
  };

  useEffect(() => {
    if (formModalBody?.record) setCurrentRecord(formModalBody.record);
  }, [formModalBody]);

  return (
    <form className="form grid grid-cols-2 gap-2">
      {formModalBody && (
        <>
          <p className="col-span-2 text-lg text-center font-bold mx-auto">
            {formModalBody.type === "upd"
              ? t(locale, "body.modal.labelTitleUpdate")
              : t(locale, "body.modal.labelTitleCreate")}
          </p>
          <div className=" grid grid-cols-2">
            <DescPBlock
              outerStyle="col-span-2 flex flex-col lg:flex-row gap-2 justify-start items-start *:text-black *:font-semibold"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.labels.year`)}: `}
              value={`${formModalBody.yearId}, ${t(
                locale,
                `body.form.valueMonth.${MONTHS[formModalBody.monthId - 1]}`
              )}`}
            />
          </div>
        </>
      )}

      {currentRecord &&
        [
          {
            name: "type",
            title: t(locale, `body.form.operations.type`),
            id: "operationTypeInput" + currentRecord?.id,
            value: currentRecord?.type,
            type: "radio",
          },
          {
            name: "tags",
            title: t(locale, `body.form.operations.labelTags`),
            id: "operationTagsInput" + currentRecord?.id,
            value: currentRecord,
            type: "",
          },
          {
            name: "amount",
            title: t(locale, `body.form.operations.amount`),
            id: "operationAmountInput" + currentRecord?.id,
            value: currentRecord?.amount,
            type: "number",
          },
          {
            id: "operationDescInput" + currentRecord?.id,
            name: "description",
            title: t(locale, `body.form.operations.description`),
            value: currentRecord?.description,
            type: "text",
          },
        ].map((f, i) =>
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
              record={currentRecord}
              setRecord={setCurrentRecord}
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
      {currentRecord && (
        <MidLevelButton
          title={t(locale, "body.modal.labelConfirm")}
          style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1 disabled:text-gray-600 disabled:bg-green-200 disabled:hover:bg-green-200 disabled:border-green-300"
          handleClick={() => handleUpdate(currentRecord, false)}
        />
      )}
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400 cols-span-1"
        handleClick={handleClear}
      />
    </form>
  );
};

export default FormRecordBlock;
