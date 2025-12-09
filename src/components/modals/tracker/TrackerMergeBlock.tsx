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
import { TRACKER_IDS } from "@/constants";
import { useModal } from "@/context/ModalContext";
import { parseMetaToDate } from "@/lib/utils/dateParser";
import { deleteTrackerUtil } from "@/idb/apiHelpers/entityApiUtil";

type TrackerMergeProps = {
  importTrackerBody: Tracker;
  oldTrackerMeta: TrackerMeta | null;
};
const TrackerMergeBlock = ({
  importTrackerBody,
  oldTrackerMeta,
}: TrackerMergeProps) => {
  const { locale, setTrackerIds } = useGlobal();
  const {
    trackerId,
    setTrackerId,
    setTrackerMeta,
    setTrackerTags,
    setTrackerYears,
  } = useTracker();
  const { closeModal } = useModal();

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
      await deleteTrackerUtil(trackerId);
    } catch (error) {
      console.error(
        `Something went wrong while deleting tracker '${trackerId}'`,
        error
      );
    } finally {
      try {
        await createNPopulate(
          importTrackerBody,
          setTrackerIds,
          setTrackerId,
          setTrackerMeta,
          setTrackerTags,
          setTrackerYears
        );
      } catch (error) {
        console.error(
          `Something went wrong while creating tracker '${trackerId}'`,
          error
        );
      }
      closeModal();
    }
  };

  const handleDoubleClick = async () => {
    if (localStorage) {
      let count = 0;
      let newId;
      const trackersString = localStorage.getItem(TRACKER_IDS);
      if (trackersString) {
        const trackerList: string[] = JSON.parse(trackersString);
        while (trackerList.some((t) => t === importTrackerBody.id + count))
          ++count;
        newId = importTrackerBody.id + count;
        await createNPopulate(
          importTrackerBody,
          setTrackerIds,
          setTrackerId,
          setTrackerMeta,
          setTrackerTags,
          setTrackerYears,
          newId
        );
        closeModal();
      }
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
          value={oldDateTime ? `${oldDateTime[0]} ${oldDateTime[1]}` : "It seems that registered data is corrupted"}
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
