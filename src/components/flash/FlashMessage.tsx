import { Flash, FlashType } from "@/context/FlashContext";
import { useEffect, useMemo, useState } from "react";
import { UtilButton } from "../buttonComponents";
import { CloseIcon } from "@/lib/icons";

const DURATION = 5000;

const styleMap: Record<FlashType, string> = {
  success: "bg-green-500 border-green-700",
  error: "bg-red-500 border-red-700",
  warning: "bg-yellow-500 border-yellow-700",
  info: "bg-blue-500 border-blue-700",
};

const styleButtonMap: Record<FlashType, string> = {
  success: "bg-green-700 hover:bg-green-800",
  error: "bg-red-700 border-red-800",
  warning: "bg-yellow-700 border-yellow-800",
  info: "bg-blue-700 border-blue-800",
};

type FlashMessageProps = {
  flash: Flash;
  closeFlash: (id: string) => void;
  closeButtonTitle: string;
};

const FlashMessage = ({
  flash,
  closeFlash,
  closeButtonTitle,
}: FlashMessageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isErrorWarning = useMemo(
    () => flash.type === "error" || flash.type === "warning",
    [flash.type]
  );
  const typeStyle = useMemo(() => styleMap[flash.type], [flash.type]);
  const typeStyleButton = useMemo(
    () => styleButtonMap[flash.type],
    [flash.type]
  );

  useEffect(() => {
    if (isErrorWarning || isHovered) return;

    const timer = setTimeout(() => {
      closeFlash(flash.id);
    }, DURATION);

    return () => clearTimeout(timer);
  }, [flash.id, isHovered, closeFlash, isErrorWarning]);

  return (
    <div
      className={`relative w-full px-2 py-1 md:rounded-lg text-white shadow-lg border-l-4 border-b md:border-b-0 transition-all duration-300 transform translate-x-0 opacity-90 ${typeStyle}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <UtilButton
        icon={<CloseIcon className="h-5 w-5" />}
        title={closeButtonTitle}
        customStyle={`absolute top-1 right-2 col-span-2 md:col-span-1 h-6 w-6 ${typeStyleButton}`}
        handleClick={() => closeFlash(flash.id)}
      />
      <p className="font-semibold mr-8">{flash.message}</p>
    </div>
  );
};

export default FlashMessage;
