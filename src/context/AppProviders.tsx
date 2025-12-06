import { ReactNode } from "react";
import { FlashProvider } from "./FlashContext";
import { GlobalProvider } from "./GlobalContext";
import { ModalProvider } from "./ModalContext";
import { TrackerProvider } from "./TrackerContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GlobalProvider>
      <TrackerProvider>
        <ModalProvider>
          <FlashProvider>{children}</FlashProvider>
        </ModalProvider>
      </TrackerProvider>
    </GlobalProvider>
  );
}
