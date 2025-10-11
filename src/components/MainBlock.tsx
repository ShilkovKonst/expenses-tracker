/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getMonthById, initEmptyMonths } from "@/lib/utils/monthHelper";
import { t } from "@/locales/locale";
import {
  CostFormType,
  FormDataType,
  MonthFormType,
  MonthIdType,
  Months,
  TagType,
  YearFormType,
} from "@/types/formTypes";
import { useEffect, useState } from "react";
import { CURRENT_YEAR } from "@/lib/constants";
import AccordionBlock from "./accordion/AccordionBlock";
import ModalBlock from "./ModalFormBlock";
import TagsBlock from "./TagsBlock";
import { useGlobal } from "@/app/context/GlobalContext";

const MainBlock = () => {
  const { locale, selectedTag, formData, setFormData } = useGlobal();

  const [costTags, setCostTags] = useState<TagType[]>([]);
  const [monthBudget, setMonthBudget] = useState<number>(0);
  const [isModal, setIsModal] = useState<boolean>(false);
  // const [modal, setModal] = useState<ModalType | null>(null);

  useEffect(() => {
    if (localStorage) {
      const rawTags = localStorage.getItem("expenseTags");
      if (!rawTags)
        localStorage.setItem("expenseTags", JSON.stringify([selectedTag]));
      const tags: TagType[] = rawTags ? JSON.parse(rawTags) : [selectedTag];
      setCostTags(tags);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`${selectedTag.type}`);
    setFormData(raw ? JSON.parse(raw) : formData);
  }, [selectedTag]);

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-2 md:p-6 mb-7">
      {/* {isModal && (
        <ModalBlock
          title={t(locale, "body.form.costsTagFormTitle")}
          inputPlaceholder={t(locale, `body.form.costsTagCustomTitle`)}
          confirmText="&#10004;"
          cancelText="&#10006;"
          checkBoxTip={t(locale, `body.modal.checkBoxTip`)}
          setIsModal={setIsModal}
          confirmClick={() => {}}
        />
      )} */}
      <div className="flex justify-between items-center w-full border-b-6 border-blue-400 pb-2">
        <h2 className="text-4xl font-semibold text-blue-950 my-auto">
          {t(locale, `body.form.title`)}
        </h2>
      </div>
      <TagsBlock costTags={costTags} setCostTags={setCostTags} />
      <AccordionBlock />
    </div>
  );
};

export default MainBlock;

function defineCurrentYearData(formData: FormDataType): YearFormType {
  let currentYear = formData.years.find((y) => y.id === CURRENT_YEAR);
  if (!currentYear) {
    const emptyMonths = initEmptyMonths();
    currentYear = {
      id: CURRENT_YEAR,
      months: emptyMonths,
      costs: 0,
      budget: 0,
    };
  }
  return currentYear;
}

function getNewFormData(
  tag: TagType,
  formData: FormDataType,
  currentYear: YearFormType
): FormDataType {
  const updatedYears: YearFormType[] = [
    ...formData.years.filter((y) => y.id !== currentYear.id),
    currentYear,
  ];
  const newFormData: FormDataType = {
    id: tag.type,
    years: updatedYears,
    totalCosts: Object.values(updatedYears).reduce(
      (acc, year) => acc + year.costs,
      0
    ),
  };
  return newFormData;
}
