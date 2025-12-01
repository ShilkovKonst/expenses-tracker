"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { IconButton } from "../buttonComponents";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";

const RegisteredTrackersBlock = () => {
  const { locale, trackerIds } = useGlobal();
  const {
    trackerId,
    setTrackerId,
    setTrackerYears,
    setTrackerMeta,
    setTrackerTags,
  } = useTracker();

  const handleChangeTrackerClick = async (id: string) => {
    console.log(id);
    await populateTrackerContex(
      id,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears
    );
  };

  return (
    <section className="w-full col-span-3 flex flex-col justify-between items-start gap-2 border-b-6 border-blue-400 pt-3 pb-2 lg:pr-2 lg:border-r-3">
      <h3 className={`block font-semibold uppercase text-sm`}>
        {t(locale, `body.form.tracker.idsTitle`)}
      </h3>
      <div className="relative overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap justify-start items-center gap-2">
        {trackerIds.map((id, i) => (
          <IconButton
            key={i}
            icon={id}
            value={id}
            title={`select new active tracker {trackerId}`}
            handleClick={handleChangeTrackerClick}
            customStyle="bg-blue-300 hover:bg-blue-400 disabled:bg-green-500 disabled:hover:bg-green-500 px-2 h-5 rounded-lg"
            disabled={trackerId === id}
          />
        ))}
      </div>
    </section>
  );
};

export default RegisteredTrackersBlock;
