const LoadingSkeleton = ({ rowNo }: { rowNo: number }) => {
  return (
    <div className="w-full h-full m-0 flex flex-col items-center justify-between">
      {Array.from({ length: rowNo }).map((_, i) => (
        <div key={i} className="w-full h-6 bg-gray-400 rounded animate-pulse" />
      ))}
    </div>
  );
};
export default LoadingSkeleton;
