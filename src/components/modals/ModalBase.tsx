import { ReactNode } from "react";
import { ValidateButton } from "../buttonComponents";

type Props = {
  title: string;
  desc?: string;
  sectionGridCols: number;
  cancelButtonTitle: string;
  onClose: () => void;
  children: ReactNode;
};

const ModalBase = ({
  title,
  desc,
  sectionGridCols,
  cancelButtonTitle,
  onClose,
  children,
}: Props) => {
  return (
    <dialog
      open
      id="foreground"
      className="fixed w-full h-full inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center justify-center"
    >
      <form
        className={`relative w-full md:w-3/4 lg:w-2/3 2xl:w-1/2 bg-blue-50 p-5 rounded-lg grid grid-cols-${sectionGridCols} gap-2`}
      >
        <h3
          className={`col-span-${sectionGridCols} text-lg font-bold text-center mx-auto`}
        >
          {title}
        </h3>
        {desc && (
          <p
            className={`col-span-${sectionGridCols} font-semibold text-xs text-center mx-auto`}
          >
            {desc}
          </p>
        )}
        {children}
        <ValidateButton
          title={cancelButtonTitle}
          customStyle="col-span-2 bg-blue-300 hover:bg-blue-400 border-blue-400"
          handleClick={onClose}
        />
      </form>
    </dialog>
  );
};

export default ModalBase;
