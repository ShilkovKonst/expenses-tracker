"use client";
import { t } from "@/locales/locale";
import { useMemo } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { createNPopulate } from "@/lib/utils/trackerDataSetter";
import DescDateBlock from "../../descriptionComponents/DescDateBlock";
import DescPBlock from "../../descriptionComponents/DescPBlock";
import { ValidateButton } from "../../buttonComponents";
import { Tracker, TrackerMeta } from "@/lib/types/dataTypes";
import { useModal } from "@/context/ModalContext";
import { parseMetaToDate } from "@/lib/utils/dateParser";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";
import { useFlash } from "@/context/FlashContext";
import { getErrorMessage } from "@/lib/utils/parseErrorMessage";
import { TrackerId } from "@/lib/types/brand";

type TrackerMergeProps = {
  importTrackerBody: Tracker;
  oldTrackerMeta: TrackerMeta | null;
};
const TrackerMergeBlock = ({
  importTrackerBody,
  oldTrackerMeta,
}: TrackerMergeProps) => {
  const { locale, allTrackersMeta, setAllTrackersMeta, setIsLoading } =
    useGlobal();
  const { setTrackerId, setTrackerMeta, setTrackerTags, setTrackerYears } =
    useTracker();
  const { closeModal } = useModal();
  const { addFlash } = useFlash();

  const isOutdated = useMemo(() => {
    if (!oldTrackerMeta) return false;
    const oldDate = parseMetaToDate(oldTrackerMeta.updatedAt);
    const newDate = parseMetaToDate(importTrackerBody.meta.updatedAt);
    return oldDate > newDate;
  }, [oldTrackerMeta, importTrackerBody]);

  const oldDateTime = useMemo(() => {
    return oldTrackerMeta?.updatedAt.split("_");
  }, [oldTrackerMeta]);

  const newDateTime = useMemo(() => {
    return importTrackerBody.meta.updatedAt.split("_");
  }, [importTrackerBody]);

  const handleReplaceClick = async () => {
    try {
      await deleteTrackerUtil(importTrackerBody.meta.id);
      await createNPopulate(
        importTrackerBody,
        setAllTrackersMeta,
        setIsLoading,
        setTrackerId,
        setTrackerMeta,
        setTrackerTags,
        setTrackerYears
      );
      addFlash(
        "success",
        `${t(locale, "body.flash.trackerUpdated", {
          trackerId: importTrackerBody.meta.title,
        })}`
      );
    } catch (error) {
      console.error(error);
      addFlash(
        "error",
        getErrorMessage(error, "Something went wrong while replacing tracker")
      );
    }
    closeModal();
  };

  const handleDoubleClick = async () => {
    if (allTrackersMeta.length > 0) {
      let count = 0;
      while (
        allTrackersMeta.some((t) => t.id === importTrackerBody.meta.id + count)
      )
        ++count;
      const newId = (importTrackerBody.meta.id + count) as TrackerId;
      const newTitle = importTrackerBody.meta.title + count;
      try {
        await createNPopulate(
          {
            ...importTrackerBody,
            meta: { ...importTrackerBody.meta, id: newId, title: newTitle },
          },
          setAllTrackersMeta,
          setIsLoading,
          setTrackerId,
          setTrackerMeta,
          setTrackerTags,
          setTrackerYears
        );
        addFlash(
          "success",
          `${t(locale, "body.flash.trackerDoubled", {
            trackerId: importTrackerBody.meta.title,
          })} - ${newTitle}`
        );
      } catch (error) {
        console.error(error);
        addFlash(
          "error",
          getErrorMessage(error, "Something went wrong while replacing tracker")
        );
      }
      closeModal();
    }
  };

  return (
    <>
      <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
        <DescDateBlock
          outerStyle="col-span-1 grid grid-cols-3 gap-2"
          titleStyle="col-span-2 my-auto font-medium p-1"
          valueStyle={`pr-6 text-xs py-1 mb-auto`}
          title={`${t(locale, `body.form.tracker.registeredDateTitle`)} `}
          value={
            oldDateTime
              ? `${oldDateTime[0]} ${oldDateTime[1]}`
              : "It seems that registered data is corrupted"
          }
        />
        <DescDateBlock
          outerStyle="col-span-1 grid grid-cols-3 gap-2"
          titleStyle="col-span-2 my-auto font-medium p-1"
          valueStyle={`w-full relative pr-6 text-xs ${
            isOutdated ? "text-orange-700" : "text-green-700"
          }`}
          title={`${t(locale, `body.form.tracker.importedDateTitle`)} `}
          value={`${newDateTime[0]} ${newDateTime[1]}`}
          isOutdated={isOutdated}
        />
      </div>
      <ValidateButton
        title={t(locale, "body.buttons.replace")}
        content={
          <DescPBlock
            titleStyle="font-bold text-black-900"
            title={t(locale, "body.buttons.replace")}
            value={t(locale, "body.buttons.descReplace")}
          />
        }
        customStyle={
          isOutdated
            ? "bg-orange-300 hover:bg-orange-400 border-orange-400"
            : "bg-green-300 hover:bg-green-400 border-green-400"
        }
        handleClick={handleReplaceClick}
      />
      <ValidateButton
        title={t(locale, "body.buttons.double")}
        content={
          <DescPBlock
            titleStyle="font-bold text-black-900"
            title={t(locale, "body.buttons.double")}
            value={t(locale, "body.buttons.descDouble")}
          />
        }
        customStyle="bg-green-300 hover:bg-green-400 border-green-400"
        handleClick={handleDoubleClick}
      />
    </>
  );
};

export default TrackerMergeBlock;
