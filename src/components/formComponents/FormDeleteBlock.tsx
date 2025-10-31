"use client";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { t } from "@/locales/locale";
import { Record } from "@/types/formTypes";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import { MONTHS } from "@/lib/constants";
import RecordDescriptionBlock from "../accordionBlockComponents/recordBlockComponents/RecordDescriptionBlock";

type FormConfirmBlockProps = {
  deleteEntity: "record" | "tag" | "tracker";
  handleDelete: (record: Record, isDelete: boolean) => void;
  handleClear: () => void;
};

const FormDeleteBlock: React.FC<FormConfirmBlockProps> = ({
  deleteEntity,
  handleDelete,
  handleClear,
}) => {
  const { locale } = useGlobal();
  const { formModalBody } = useModal();

  const handleClick = () => {
    if (formModalBody?.record) {
      handleDelete(formModalBody.record, true);
    }
  };

  return (
    <form className="form grid grid-cols-2 gap-2">
      <p className="col-span-2 text-lg text-center font-bold mx-auto">
        {t(locale, "body.modal.labelTitleDelete", {
          deleteEntity: t(locale, `body.modal.deleteEntity.${deleteEntity}`),
        })}
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
            <RecordDescriptionBlock
              outerStyle="col-span-2 grid grid-cols-4 gap-4 my-auto"
              labelRecordTags={`${t(
                locale,
                `body.form.operations.labelTags`
              )}: `}
              labelRecordDescription={`${t(
                locale,
                `body.form.operations.description`
              )}: `}
              labelRecordAmount={`${t(
                locale,
                `body.form.operations.amount`
              )}: `}
              labelRecordDay={`${t(locale, `body.form.labels.date`)}: `}
              recordType={formModalBody.record.type}
              recordTags={formModalBody.record.tags.map((t) => t.title)}
              recordDescription={formModalBody.record.description}
              recordAmount={formModalBody.record.amount}
              recordDay={formModalBody.record.day}
            />
          </>
        )}
      </div>
      <MidLevelButton
        title={t(locale, "body.modal.labelDelete")}
        style="bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

export default FormDeleteBlock;
