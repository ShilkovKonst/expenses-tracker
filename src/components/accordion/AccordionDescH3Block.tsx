"use client";

type AccordionDescH3BlockProps = {
  label: string | number;
};

const AccordionDescH3Block: React.FC<AccordionDescH3BlockProps> = ({
  label,
}) => {
  return (
    <div className={`col-span-1 flex justify-start items-center`}>
      <h3
        className={`text-sm font-bold text-blue-800 capitalize`}
      >
        {label}
      </h3>
    </div>
  );
};

export default AccordionDescH3Block;
