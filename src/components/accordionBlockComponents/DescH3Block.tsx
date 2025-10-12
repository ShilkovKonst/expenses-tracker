"use client";

type DescH3BlockProps = {
  label: string | number;
};

const DescH3Block: React.FC<DescH3BlockProps> = ({ label }) => {
  return (
    <div className={`col-span-1 flex justify-start items-center`}>
      <h3 className={`text-sm font-bold text-blue-800 capitalize`}>{label}</h3>
    </div>
  );
};

export default DescH3Block;
