"use client";
import TagButton from "../buttonComponents/TagButton";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { t } from "@/locales/locale";
import { Operation } from "@/types/formTypes";
import OperationDescriptionBlock from "../accordionBlockComponents/operationBlockComponents/OperationDescriptionBlock";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import { MONTHS } from "@/lib/constants";

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
    <form className="form bg-blue-50 p-5 rounded-lg grid grid-cols-2 gap-2">
      <p className="col-span-2 text-lg text-center font-bold mx-auto">
        {t(locale, "body.modal.labelTitleDelete")}
      </p>
      <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
        {formModalBody && (
          <>
            <div className=" grid grid-cols-2 gap-2 sm:gap-0">
              <DescPBlock
                outerStyle="col-span-1 flex flex-col lg:flex-row lg:gap-1 justify-start items-start"
                spanStyle={`text-xs truncate`}
                label={`${t(locale, `body.form.labels.year`)}: `}
                value={`${formModalBody.yearId}, ${t(
                  locale,
                  `body.form.valueMonth.${MONTHS[formModalBody.monthId - 1]}`
                )}`}
              />
            </div>
            <OperationDescriptionBlock
              outerStyle="col-span-2 grid grid-cols-4 gap-4 my-auto"
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
              operationType={formModalBody.operation.type}
              operationTags={formModalBody.operation.tags}
              operationDescription={formModalBody.operation.description}
              operationAmount={formModalBody.operation.amount}
            />
          </>
        )}
      </div>
      <TagButton
        title={t(locale, "body.modal.labelDelete")}
        style="bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleClick}
      />
      <TagButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

export default FormDeleteBlock;
