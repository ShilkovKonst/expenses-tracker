/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useModalBody } from "@/hooks/useModalBody";
import { t } from "@/locales/locale";
import { useEffect, useState } from "react";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { OkIcon, WarningIcon } from "@/lib/icons";
import { getMetadata } from "@/idb/metaCRUD";
import { parseMetaDate } from "@/lib/utils/trackerDataSetter";

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
            <DescPBlock
              outerStyle="pr-6 col-span-1 grid grid-cols-3 gap-2"
              titleStyle="col-span-2"
              spanStyle={`text-xs py-1 mb-auto`}
              label={`${t(locale, `body.form.tracker.registeredDateTitle`)} `}
              value={
                oldTrackerDate
                  ? `${oldTrackerDate.split("_")[0]} ${oldTrackerDate.split("_")[1]?.slice(0, 8)}`
                  : ""
              }
            />
            <DescPBlock
              outerStyle="relative pr-6 col-span-1 grid grid-cols-3 gap-2"
              titleStyle="col-span-2"
              spanStyle={`text-xs py-1 mb-auto ${
                isImportOutdated ? "text-orange-700" : "text-green-700"
              }`}
              label={`${t(locale, `body.form.tracker.importedDateTitle`)} `}
              value={
                <DateDescBlock
                  date={
                    newTrackerDate
                      ? `${newTrackerDate.split("_")[0]} ${newTrackerDate.split("_")[1]?.slice(0, 8)}`
                      : ""
                  }
                  isOutdated={isImportOutdated}
                />
              }
            />
          </div>
        )}
      </div>
      <MidLevelButton
        title={
          <ButtonTitleBlock
            title={t(locale, "body.modal.labelReplace")}
            desc={t(locale, "body.modal.descReplace")}
          />
        }
        style={`${
          isImportOutdated
            ? "bg-orange-300 hover:bg-orange-400 border-orange-400"
            : "bg-green-300 hover:bg-green-400 border-green-400"
        }  flex flex-col justify-sart items-center`}
        handleClick={handleReplaceClick}
      />
      <MidLevelButton
        title={
          <ButtonTitleBlock
            title={t(locale, "body.modal.labelDouble")}
            desc={t(locale, "body.modal.descDouble")}
          />
        }
        style="bg-green-300 hover:bg-green-400 border-green-400 flex flex-col justify-sart items-center"
        handleClick={handleDoubleClick}
      />
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="col-span-2 bg-blue-300 hover:bg-blue-400 border-blue-400"
        handleClick={handleClear}
      />
    </form>
  );
};

type DateDescProps = { date: string; isOutdated: boolean };
const DateDescBlock = ({ date, isOutdated }: DateDescProps) => {
  return (
    <>
      {date}
      {isOutdated ? (
        <WarningIcon className="absolute top-0 bottom-0 right-0" />
      ) : (
        <OkIcon className="absolute top-0 bottom-0 right-0" />
      )}
    </>
  );
};

type ButtonTitleProps = { title: string; desc: string };
const ButtonTitleBlock = ({ title, desc }: ButtonTitleProps) => {
  return (
    <>
      <p className="text-center mb-1">{title}</p>
      <p className="text-center text-xs font-normal">{desc}</p>
    </>
  );
};

export default ModalImportTrackerBlock;
