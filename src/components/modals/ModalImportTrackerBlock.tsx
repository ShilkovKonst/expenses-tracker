/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { t } from "@/locales/locale";
import { getMetadata } from "@/idb/metaCRUD";
import { useEffect, useMemo, useState } from "react";
import { MidLevelButton } from "@/components/buttonComponents";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { useModalBody } from "@/hooks/useModalBody";
import { parseMetaDate } from "@/lib/utils/trackerDataSetter";
import DescDateBlock from "../descriptionComponents/DescDateBlock";
import DescPBlock from "../descriptionComponents/DescPBlock";

const ModalImportTrackerBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
  const { handleClear } = useModal();
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();

  const { importTrackerBody } = useModalBody();

  const { 0: oldTrackerDate, 1: setOldTrackerDate } = useState<string>("");
  const { 0: newTrackerDate, 1: setNewTrackerDate } = useState<string>("");
  const { 0: isImportOutdated, 1: setIsImportOutdated } =
    useState<boolean>(false);

  useEffect(() => {
    if (localStorage && importTrackerBody) {
      let cancelled = false;

      async function getOldUpdateDate() {
        if (!cancelled && importTrackerBody) {
          const oldMeta = await getMetadata(importTrackerBody.id);
          if (oldMeta) {
            setOldTrackerDate(oldMeta.updatedAt);
          }
          setNewTrackerDate(importTrackerBody.meta.updatedAt);
        }
      }

      getOldUpdateDate();

      return () => {
        cancelled = true;
      };
    }
  }, [importTrackerBody]);

  useEffect(() => {
    if (oldTrackerDate && newTrackerDate) {
      const oldDate = parseMetaDate(oldTrackerDate);
      const newDate = parseMetaDate(newTrackerDate);
      setIsImportOutdated(oldDate > newDate);
    }
  }, [oldTrackerDate, newTrackerDate]);

  const handleReplaceClick = () => {
    if (localStorage && importTrackerBody) {
      localStorage.setItem(
        importTrackerBody.id,
        JSON.stringify(importTrackerBody)
      );

      setTrackerId(importTrackerBody.id);
      setTrackerMeta({ ...importTrackerBody.meta });
      setTrackerTags({ ...importTrackerBody.tagsPool });
      setTrackerYears({ ...importTrackerBody.years });

      handleClear();
    }
  };

  const handleDoubleClick = () => {
    if (localStorage && importTrackerBody) {
      let count = 0;
      while (localStorage.getItem(importTrackerBody.id + count)) ++count;
      const newId = importTrackerBody.id + count;
      localStorage.setItem(
        newId,
        JSON.stringify({ ...importTrackerBody, id: newId })
      );

      setTrackerId(newId);
      setTrackerMeta({ ...importTrackerBody.meta });
      setTrackerTags({ ...importTrackerBody.tagsPool });
      setTrackerYears({ ...importTrackerBody.years });

      setTrackerIds([...trackerIds, newId]);

      handleClear();
    }
  };

  const oldDate = useMemo(() => {
    if (!oldTrackerDate) return "";
    const fullDate = oldTrackerDate.split("_");
    return `${fullDate[0]} ${fullDate[1].slice(0, 8)}`;
  }, [oldTrackerDate]);

  const newDate = useMemo(() => {
    if (!newTrackerDate) return "";
    const fullDate = newTrackerDate.split("_");
    return `${fullDate[0]} ${fullDate[1].slice(0, 8)}`;
  }, [newTrackerDate]);

  return (
    <form className="form grid grid-cols-2 gap-2">
      <p className="col-span-2 text-lg text-center font-bold mx-auto">
        {t(locale, `body.form.tracker.mergeTitle`, {
          trackerId: importTrackerBody ? importTrackerBody?.id : "",
        })}
      </p>
      <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
        {oldTrackerDate && newTrackerDate && (
          <div className="w-full grid grid-cols-1 gap-1">
            <DescDateBlock
              outerStyle="pr-6 col-span-1 grid grid-cols-3 gap-2"
              titleStyle="col-span-2 my-auto font-medium p-1"
              valueStyle={`text-xs py-1 mb-auto`}
              title={`${t(locale, `body.form.tracker.registeredDateTitle`)} `}
              value={oldDate}
            />
            <DescDateBlock
              outerStyle="relative pr-6 col-span-1 grid grid-cols-3 gap-2"
              titleStyle="col-span-2 my-auto font-medium p-1"
              valueStyle={`text-xs mb-auto ${
                isImportOutdated ? "text-orange-700" : "text-green-700"
              }`}
              title={`${t(locale, `body.form.tracker.importedDateTitle`)} `}
              value={newDate}
              isOutdated={isImportOutdated}
            />
          </div>
        )}
      </div>
      <MidLevelButton
        title={t(locale, "body.modal.labelReplace")}
        content={
          <DescPBlock
            titleStyle="font-bold text-black-900"
            title={t(locale, "body.modal.labelReplace")}
            value={t(locale, "body.modal.descReplace")}
          />
        }
        customStyle={
          isImportOutdated
            ? "bg-orange-300 hover:bg-orange-400 border-orange-400"
            : "bg-green-300 hover:bg-green-400 border-green-400"
        }
        handleClick={handleReplaceClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelDouble")}
        content={
          <DescPBlock
            titleStyle="font-bold text-black-900"
            title={t(locale, "body.modal.labelDouble")}
            value={t(locale, "body.modal.descDouble")}
          />
        }
        customStyle="bg-green-300 hover:bg-green-400 border-green-400"
        handleClick={handleDoubleClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        content={t(locale, "body.modal.labelCancel")}
        customStyle="col-span-2 bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

export default ModalImportTrackerBlock;
