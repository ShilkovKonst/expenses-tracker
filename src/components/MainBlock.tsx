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
import { FormEvent, useEffect, useState } from "react";
import { CURRENT_YEAR, EMPTY_FORM_MONTHS } from "@/lib/constants";
import AccordionBlock from "./AccordionBlock";
import ModalBlock from "./ModalFormBlock";
import TagsBlock from "./TagsBlock";
import { useGlobal } from "@/app/context/GlobalContext";

const MainBlock = () => {
  const { locale } = useGlobal();

  const [selectedTag, setSelectedTag] = useState<TagType>({
    id: 0,
    type: "home",
  });
  const [costTags, setCostTags] = useState<TagType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthIdType | "">("");
  const [costs, setCosts] = useState<CostFormType[]>([]);
  const [monthBudget, setMonthBudget] = useState<number>(0);
  const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    years: [] as YearFormType[],
    totalCosts: 0,
  });

  const [isModal, setIsModal] = useState<boolean>(false);
  // const [modal, setModal] = useState<ModalType | null>(null);

  useEffect(() => {
    if (localStorage) {
      const raw = localStorage.getItem("costTags");
      if (!raw) localStorage.setItem("costTags", JSON.stringify(["home"]));
      const tags: TagType[] = raw ? JSON.parse(raw) : ["home"];
      setCostTags(tags);
    }
  }, []);

  useEffect(() => {
    console.log("test");
    const raw = localStorage.getItem(`costs-${selectedTag.type}`);
    setFormData(
      raw
        ? JSON.parse(raw)
        : {
            years: {
              [CURRENT_YEAR]: {
                months: EMPTY_FORM_MONTHS,
                costs: 0,
                balance: 0,
                budget: 0,
              },
            },
            totalCosts: 0,
          }
    );
    setIsFormUpdated(false);
    setSelectedMonth("");
  }, [isFormUpdated, selectedTag]);

  useEffect(() => {
    if (!selectedMonth) {
      setCosts([]);
      return;
    }
    const currentYear = formData.years[CURRENT_YEAR];
    const month = currentYear?.months[selectedMonth];
    setCosts(
      month?.costs?.length > 0
        ? month?.costs
        : [{ id: 0, type: "", description: "", amount: 0 }]
    );
  }, [selectedMonth]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return;

    const month = getMonthById(selectedMonth);
    const newMonth: MonthFormType = {
      id: selectedMonth,
      title: month as Months,
      costs: costs,
      costsAmount: costs.reduce((acc, c) => acc + c.amount, 0),
      budget: monthBudget,
    };

    let currentYear = defineCurrentYearData(formData);
    const updatedMonths: MonthFormType[] = [
      ...currentYear.months.filter((m) => m.id !== selectedMonth),
      newMonth,
    ];
    currentYear = {
      ...currentYear,
      months: updatedMonths,
      costs: Object.values(updatedMonths).reduce(
        (acc, m) => acc + m.costsAmount,
        0
      ),
    };

    const newFormData = getNewFormData(selectedTag, formData, currentYear);
    setFormData(newFormData);
    localStorage.setItem(`costs-${selectedTag}`, JSON.stringify(newFormData));

    setIsFormUpdated(true);
  };

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-6 mb-7">
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
      <TagsBlock
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        costTags={costTags}
        setCostTags={setCostTags}
      />
      <AccordionBlock formData={formData} costs={costs} setCosts={setCosts} />
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
