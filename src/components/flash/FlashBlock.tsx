"use client"
import { Flash, useFlash } from "@/context/FlashContext";
import FlashMessage from "./FlashMessage";

export default function FlashBlock() {
    const { flash, closeFlash } = useFlash();

    if (flash.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[1000] space-y-3">
            {flash.map((flash: Flash) => (
                <FlashMessage key={flash.id} flash={flash} closeFlash={closeFlash} />
            ))}
        </div>
    );
}