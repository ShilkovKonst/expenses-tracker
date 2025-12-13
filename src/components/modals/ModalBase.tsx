import { ReactNode } from "react";
import { UtilButton, ValidateButton } from "../buttonComponents";
import { CloseIcon } from "@/lib/icons";

type Props = {
  title: string;
  desc?: string;
  sectionGridCols: number;
  closeButtonTitle: string;
  cancelButtonTitle: string;
  onClose: () => void;
  children: ReactNode;
};

const ModalBase = ({
  title,
  desc,
  sectionGridCols,
  closeButtonTitle,
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
        className={`relative w-full md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3 bg-blue-50 p-3 rounded-lg grid grid-cols-${sectionGridCols} gap-2`}
      >
        <UtilButton
          icon={<CloseIcon className="h-7 w-7" />}
          title={closeButtonTitle}
          customStyle="absolute top-3 right-3 col-span-2 md:col-span-1 h-8 w-8 bg-blue-400 hover:bg-blue-500"
          handleClick={onClose}
        />
        <h3
          className={`col-span-${sectionGridCols} min-h-9 text-lg font-bold text-center mx-8`}
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
