/* eslint-disable react-hooks/exhaustive-deps */
import { ModalBodyType, useModal } from "@/context/ModalContext";
import { isModalBodyType } from "@/lib/utils/dataValidator";
import { GlobalDataType } from "@/types/formTypes";
import { useEffect, useState } from "react";

export function useModalBody() {
  const { modalBody } = useModal();
  const { 0: globalBody, 1: setGlobalBody } = useState<GlobalDataType | null>(
    null
  );
  const { 0: recordBody, 1: setRecordBody } = useState<ModalBodyType | null>(
    null
  );

  useEffect(() => {
    if (modalBody) {
      if (isModalBodyType(modalBody)) setRecordBody(modalBody);
      else setGlobalBody(modalBody);
    }
  }, [modalBody]);

  return { recordBody, globalBody };
}
