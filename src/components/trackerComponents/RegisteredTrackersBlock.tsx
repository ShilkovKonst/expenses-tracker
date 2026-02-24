"use client";
import { useGlobal } from "@/context/GlobalContext";
import { Locale, t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { IconButton } from "../buttonComponents";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import { TrackerId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { parseMetaToDate } from "@/lib/utils/dateParser";
import LoadingSkeleton from "../LoadingSkeleton";
import NoDataPlaceholder from "../NoDataPlaceholder";
import { useCallback, useRef, useState, useTransition } from "react";

const RegisteredTrackersBlock = () => {
  const { locale, allTrackersMeta, isLoading } = useGlobal();

  const time = useCallback(
    (s: string) => (parseMetaToDate(s) ?? new Date()).getTime(),
    [],
  );

  return (
    <section className="w-full col-span-3 flex gap-2 h-20">
      <div className="border-b-6 border-blue-400 w-full flex flex-col justify-between items-start md:gap-3 pb-3">
        {isLoading ? (
          <LoadingSkeleton rowNo={2} />
        ) : allTrackersMeta.length > 0 ? (
          <RegisteredData
            locale={locale}
            allTrackersMeta={allTrackersMeta.sort(
              (a, b) => time(b.updatedAt) - time(a.updatedAt),
            )}
          />
        ) : (
          <NoDataPlaceholder
            withArrows
            text={t(locale, "body.form.tracker.idsTitleEmpty")}
          />
        )}
      </div>
      <div className="hidden lg:block mb-4 lg:border-r-3 border-blue-400"></div>
    </section>
  );
};

export default RegisteredTrackersBlock;

type RegisteredDataProps = {
  locale: Locale;
  allTrackersMeta: TrackerMeta[];
};
const RegisteredData = ({ locale, allTrackersMeta }: RegisteredDataProps) => {
  const {
    trackerId,
    setTrackerId,
    setTrackerYears,
    setTrackerMeta,
    setTrackerTags,
  } = useTracker();

  const [, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  // Tracks the most recent request so stale results from slower requests are ignored.
  const latestRequestId = useRef(0);

  const handleChangeTrackerClick = async (id: string) => {
    const requestId = ++latestRequestId.current;
    setLoadingId(id);

    await populateTrackerContex(
      id as TrackerId,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears,
      // Guard: only apply state if this is still the latest request
      (cb) => {
        if (latestRequestId.current === requestId) startTransition(cb);
      },
    );

    if (latestRequestId.current === requestId) setLoadingId(null);
  };

  return (
    <>
      <h3 className={`block font-semibold uppercase text-sm h-6`}>
        {t(locale, `body.form.tracker.idsTitle`)}
      </h3>
      <div className="flex flex-wrap justify-start items-center gap-2">
        {allTrackersMeta.map((meta, i) => {
          const isActive = trackerId === meta.id && loadingId === null;
          const isLoading = loadingId === meta.id;
          return (
            <IconButton
              key={i}
              icon={meta.title}
              value={meta.id}
              title={`${t(locale, "body.buttons.select")} - ${meta.title}`}
              handleClick={handleChangeTrackerClick}
              customStyle={`px-2 h-6 rounded transition-colors duration-300 ${
                isLoading
                  ? "bg-blue-400 animate-pulse"
                  : "bg-blue-300 hover:bg-blue-400 disabled:bg-green-500 disabled:hover:bg-green-500"
              }`}
              disabled={isActive || isLoading}
            />
          );
        })}
      </div>
    </>
  );
};
