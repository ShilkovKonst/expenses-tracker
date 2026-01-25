const NoDataPlaceholder = ({
  text,
  withArrows,
}: {
  text: string;
  withArrows?: boolean;
}) => {
  return (
    <div className={`flex justify-between ${withArrows ? "h-full" : "h-auto"} items-center gap-2`}>
      {withArrows && (
        <>
          <p className="block lg:hidden text-xl font-bold">&#8593;</p>
          <p className="hidden lg:block text-xl font-bold">&#8594;</p>
        </>
      )}
      <p className="text-sm">
        {text /* {t(locale, "body.form.tracker.idsTitleEmpty")} */}
      </p>
      {withArrows && (
        <>
          <p className="block lg:hidden text-xl font-bold">&#8593;</p>
          <p className="hidden lg:block text-xl font-bold">&#8594;</p>
        </>
      )}
    </div>
  );
};
export default NoDataPlaceholder;
