"use client";
import { useGlobal } from "@/context/GlobalContext";
import { Locale, t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { IconButton } from "../buttonComponents";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";
import { TrackerId } from "@/lib/types/brand";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { parseMetaToDate } from "@/lib/utils/dateParser";

const RegisteredTrackersBlock = () => {
  const { locale, allTrackersMeta, isLoading } = useGlobal();
  return (
    <section className="w-full col-span-3 flex gap-2">
      <div className="border-b-6 border-blue-400 w-full flex flex-col justify-between items-start md:gap-3 pb-3">
        {isLoading ? (
          <p>loading data</p>
        ) : allTrackersMeta.length > 0 ? (
          <RegisteredData
            locale={locale}
            allTrackersMeta={allTrackersMeta.sort(
              (a, b) =>
                parseMetaToDate(b.updatedAt).getTime() -
                parseMetaToDate(a.updatedAt).getTime()
            )}
          />
        ) : (
          <RegisteredPlaceholder locale={locale} />
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

  const handleChangeTrackerClick = async (id: string) => {
    await populateTrackerContex(
      id as TrackerId,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears
    );
  };

  return (
    <>
      <h3 className={`block font-semibold uppercase text-sm h-6`}>
        {t(locale, `body.form.tracker.idsTitle`)}
      </h3>
      <div className="flex flex-wrap justify-start items-center gap-2">
        {allTrackersMeta.map((meta, i) => (
          <IconButton
            key={i}
            icon={meta.title}
            value={meta.id}
            title={`${t(locale, "body.buttons.select")} - ${meta.title}`}
            handleClick={handleChangeTrackerClick}
            customStyle="bg-blue-300 hover:bg-blue-400 disabled:bg-green-500 disabled:hover:bg-green-500 px-2 h-6 rounded-lg"
            disabled={trackerId === meta.id}
          />
        ))}
      </div>
    </>
  );
};

const RegisteredPlaceholder = ({ locale }: { locale: Locale }) => {
  return (
    <div className="flex justify-between items-start lg:items-center gap-2">
      <p className="block lg:hidden text-xl font-bold">&#8593;</p>
      <p className="hidden lg:block text-xl font-bold">&#8594;</p>
      <p className="text-xs md:text-sm">
        {t(locale, "body.form.tracker.idsTitleEmpty")}
      </p>
      <p className="block lg:hidden text-xl font-bold">&#8593;</p>
      <p className="hidden lg:block text-xl font-bold">&#8594;</p>
    </div>
  );
};
