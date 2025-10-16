"use client";
import TagButton from "../buttonComponents/TagButton";
import { useGlobal } from "@/app/context/GlobalContext";
import { useModal } from "@/app/context/ModalContext";
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
  const { formDelete } = useModal();

  const handleClick = () => {
    if (formDelete?.operation) {
      handleDelete(formDelete.operation, true);
    }
  };

  return (
    <form className="bg-blue-50 p-3 rounded-lg">
      <div>
        <p className="text-lg text-center font-bold">
          {t(locale, "body.modal.labelTitleDelete")}
        </p>
        {formDelete?.operation && (
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
            operationType={formDelete?.operation.type}
            operationTags={formDelete?.operation.tags}
            operationDescription={formDelete?.operation.description}
            operationAmount={formDelete?.operation.amount}
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
