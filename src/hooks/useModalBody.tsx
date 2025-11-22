/* eslint-disable react-hooks/exhaustive-deps */
import { ModalBodyType, useModal } from "@/context/ModalContext";
import { isModalBodyType } from "@/lib/utils/dataValidator";
import { GlobalDataType } from "@/lib/types/dataTypes";
import { useEffect, useState } from "react";

export function useModalBody() {
  const { modalBody } = useModal();
  const { 0: importTrackerBody, 1: setImportTrackerBody } =
    useState<GlobalDataType | null>(null);
  const { 0: recordBody, 1: setRecordBody } = useState<ModalBodyType | null>(
    null
  );

  useEffect(() => {
    if (modalBody) {
      if (isModalBodyType(modalBody)) setRecordBody(modalBody);
      else setImportTrackerBody(modalBody);
    }
  }, [modalBody]);

  return { recordBody, importTrackerBody };
}
