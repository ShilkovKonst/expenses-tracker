"use client";
import TagButton from "../buttonComponents/TagButton";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { t } from "@/locales/locale";
import { Operation } from "@/types/formTypes";
import OperationDescriptionBlock from "../accordionBlockComponents/operationBlockComponents/OperationDescriptionBlock";

type FormConfirmBlockProps = {
  handleDelete: (operation: Operation, isDelete: boolean) => void;
  handleClear: () => void;
};

const FormDeleteBlock: React.FC<FormConfirmBlockProps> = ({
  handleDelete,
  handleClear,
}) => {
  const { locale } = useGlobal();
  const { formModalBody } = useModal();

  const handleClick = () => {
    if (formModalBody?.operation) {
      handleDelete(formModalBody.operation, true);
    }
  };

  return (
    <form className="form bg-blue-50 p-5 rounded-lg">
      <div className="flex flex-col gap-2 justify-center items-center mb-3">
        <p className="text-lg text-center font-bold">
          {t(locale, "body.modal.labelTitleDelete")}
        </p>
        {formModalBody?.operation && (
          <OperationDescriptionBlock
            labelOperationTags={`${t(
              locale,
              `body.form.operations.labelTags`
            )}: `}
            labelOperationDescription={`${t(
              locale,
              `body.form.operations.description`
            )}: `}
            labelOperationAmount={`${t(
              locale,
              `body.form.operations.amount`
            )}: `}
            operationType={formModalBody?.operation.type}
            operationTags={formModalBody?.operation.tags}
            operationDescription={formModalBody?.operation.description}
            operationAmount={formModalBody?.operation.amount}
          />
        )}
      </div>

      <div className="flex justify-center items-center gap-2">
        <TagButton
          title={t(locale, "body.modal.labelDelete")}
          style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1"
          handleClick={handleClick}
        />
        <TagButton
          title={t(locale, "body.modal.labelCancel")}
          style="bg-red-300 hover:bg-red-400 border-red-400 cols-span-1 disabled:text-gray-600 disabled:bg-red-200 disabled:hover:bg-red-200 disabled:border-red-300"
          handleClick={handleClear}
        />
      </div>
    </form>
  );
};

export default FormDeleteBlock;
