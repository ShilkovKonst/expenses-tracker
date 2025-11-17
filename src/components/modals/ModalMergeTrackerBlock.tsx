/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useModalBody } from "@/hooks/useModalBody";
import { validate } from "@/lib/utils/dataValidator";
import { t } from "@/locales/locale";
import { GlobalDataType } from "@/types/formTypes";
import { useEffect, useState } from "react";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useModal } from "@/context/ModalContext";

const ModalMergeTrackerBlock = () => {
  const { locale } = useGlobal();
  const { handleClear } = useModal();
  const { globalBody } = useModalBody();

  const { 0: oldTracker, 1: setOldTracker } = useState<GlobalDataType | null>(
    null
  );

  useEffect(() => {
    if (localStorage && globalBody) {
      const raw = localStorage.getItem(globalBody.id);
      if (raw) {
        const validated = validate(JSON.parse(raw));
        if (validated.success) {
          setOldTracker(validated.data);
        }
      }
    }
  }, [globalBody]);

  const handleMergeClick = () => {};
  const handleReplaceClick = () => {};

  return (
    <form className="form grid grid-cols-2 gap-2">
      <p className="col-span-2 text-lg text-center font-bold mx-auto">
        {t(locale, "body.modal.labelTitleDelete", {
          deleteEntity: t(locale, `body.form.tracker.mergeTitle`, {
            trackerId: globalBody ? globalBody?.id : "",
          }),
        })}
      </p>
      <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
        {oldTracker && globalBody && (
          <div className="w-full grid grid-cols-2 gap-2">
            <DescPBlock
              outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.tracker.registeredDateTitle`)} `}
              value={`${oldTracker.meta.updatedAt}`}
            />
            <DescPBlock
              outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.tracker.importedDateTitle`)} `}
              value={`${globalBody.meta.updatedAt}`}
            />
          </div>
        )}
      </div>
      <MidLevelButton
        title={t(locale, "body.modal.labelMerge")}
        style="bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleMergeClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelReplace")}
        style="bg-red-300 hover:bg-red-400 border-red-400"
        handleClick={handleReplaceClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

export default ModalMergeTrackerBlock;
