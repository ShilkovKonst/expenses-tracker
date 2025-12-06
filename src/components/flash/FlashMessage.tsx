import { Flash, FlashType } from "@/context/FlashContext";
import { useEffect, useMemo, useState } from "react";

const DURATION = 5000;

const styleMap: Record<FlashType, string> = {
    success: "bg-green-500 border-green-700",
    error: "bg-red-500 border-red-700",
    warning: "bg-yellow-500 border-yellow-700",
    info: "bg-blue-500 border-blue-700",
};

const FlashMessage = ({ flash, closeFlash }: { flash: Flash, closeFlash: (id: string) => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    const isErrorWarning = useMemo(() => flash.type === "error" || flash.type === "warning", [flash.type])
    const typeStyle = useMemo(() => styleMap[flash.type], [flash.type]);

    useEffect(() => {
        if (isErrorWarning || isHovered) return;

        const timer = setTimeout(() => {
            closeFlash(flash.id);
        }, DURATION);

        return () => clearTimeout(timer);
    }, [flash.id, isHovered, closeFlash, isErrorWarning]);

    return (
        <div
            className={`w-full p-4 text-white rounded-lg shadow-lg border-l-4 transition-all duration-300 transform translate-x-0 opacity-100 ${typeStyle}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-start">
                <p className="font-semibold">{flash.message}</p>

                <button
                    onClick={() => closeFlash(flash.id)}
                    className="ml-4 text-white opacity-80 hover:opacity-100"
                    aria-label="Закрыть уведомление"
                >
                    &times;
                </button>
            </div>
        </div>
    )
}

export default FlashMessage