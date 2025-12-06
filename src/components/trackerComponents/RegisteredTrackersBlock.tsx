"use client";
import { useGlobal } from "@/context/GlobalContext";
import { Locale, t } from "@/locales/locale";
import { useTracker } from "@/context/TrackerContext";
import { IconButton } from "../buttonComponents";
import { populateTrackerContex } from "@/lib/utils/updateLocalTrackerIds";

const RegisteredTrackersBlock = () => {
  const { locale, trackerIds } = useGlobal();

  return (
    <section className="w-full col-span-3 flex gap-2">
      <div className="border-b-6 border-blue-400 w-full pt-2 pb-2">
        {trackerIds.length > 0 ?
          <RegisteredData locale={locale} trackerIds={trackerIds} />
          :
          <RegisteredPlaceholder locale={locale} />}
      </div>
      <div className="hidden lg:block mb-4 lg:border-r-3 border-blue-400"></div>
    </section>
  );
};

export default RegisteredTrackersBlock;

type RegisteredDataProps = {
  locale: Locale;
  trackerIds: string[];
}
const RegisteredData = ({ locale, trackerIds }: RegisteredDataProps) => {
  const {
    trackerId,
    setTrackerId,
    setTrackerYears,
    setTrackerMeta,
    setTrackerTags,
  } = useTracker();

  const handleChangeTrackerClick = async (id: string) => {
    await populateTrackerContex(
      id,
      setTrackerId,
      setTrackerMeta,
      setTrackerTags,
      setTrackerYears
    );
  };

  return (
    <>
      <h3 className={`block font-semibold uppercase text-sm`}>
        {t(locale, `body.form.tracker.idsTitle`)}
      </h3>
      <div className="pt-2 transition-[height] duration-200 ease-in-out flex flex-wrap justify-start items-center gap-2">
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
    </>
  )
}

const RegisteredPlaceholder = ({ locale }: { locale: Locale }) => {
  return (
    <div className="flex justify-between items-start lg:items-center gap-2">
      <p className="block lg:hidden text-xl font-bold">&#8593;</p>
      <p className="hidden lg:block text-xl font-bold">&#8594;</p>
      <p className="text-xs md:text-sm">{t(locale, "body.form.tracker.idsTitleEmpty")}</p>
      <p className="block lg:hidden text-xl font-bold">&#8593;</p>
      <p className="hidden lg:block text-xl font-bold">&#8594;</p>
    </div>
  )
}