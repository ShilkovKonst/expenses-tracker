/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getMonthById, initEmptyMonths } from "@/lib/utils/monthHelper";
import { Locale, t } from "@/locales/locale";
import {
  CostFormType,
  FormType,
  MonthFormType,
  MonthIdType,
  Months,
  TagType,
  YearFormType,
} from "@/types/formTypes";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CURRENT_YEAR, EMPTY_FORM_MONTHS } from "@/lib/constants";
import FormCostsBlock from "./FormCostsBlock";
import FormMonthBlock from "./FormMonthBlock";
import AccordionBlock from "./AccordionBlock";
import { ModalType } from "@/types/componentTypes";
import ModalBlock from "./ModalFormBlock";
import TagsBlock from "./TagsBlock";

const MainBlock = () => {
  const { locale } = useParams<{ locale: Locale }>();

  const [selectedTag, setSelectedTag] = useState<TagType>({ type: "home" });
  const [costTags, setCostTags] = useState<TagType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<MonthIdType | "">("");
  const [costs, setCosts] = useState<CostFormType[]>([]);
  const [monthBudget, setMonthBudget] = useState<number>(0);
  const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormType>({
    years: {} as Record<number, YearFormType>,
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
        : [{ type: "", description: "", amount: 0 }]
    );
  }, [selectedMonth]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMonth) return;

    const month = getMonthById(selectedMonth)!;
    const newMonth: MonthFormType = {
      title: month as Months,
      costs: costs,
      monthCosts: costs.reduce((acc, c) => acc + c.amount, 0),
      budget: monthBudget,
    };

    let currentYear = defineCurrentYearData(formData);
    const updatedMonths = { ...currentYear.months, [selectedMonth]: newMonth };
    currentYear = {
      ...currentYear,
      months: updatedMonths,
      costs: Object.values(updatedMonths).reduce(
        (acc, m) => acc + m.monthCosts,
        0
      ),
    };

    const newFormData = getNewFormData(formData, currentYear);
    setFormData(newFormData);
    localStorage.setItem(`costs-${selectedTag}`, JSON.stringify(newFormData));

    setIsFormUpdated(true);
  };

  return (
    <div className="font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-6 mb-7">
      {isModal && (
        <ModalBlock
          title={t(locale, "body.form.costsTagFormTitle")}
          inputPlaceholder={t(locale, `body.form.costsTagCustomTitle`)}
          confirmText="&#10004;"
          cancelText="&#10006;"
          checkBoxTip={t(locale, `body.modal.checkBoxTip`)}
          setIsModal={setIsModal}
          confirmClick={() => {}}
        />
      )}
      <div className="flex justify-between items-center w-full border-b-6 border-blue-400 pb-2">
        <h2 className="text-4xl font-semibold text-blue-950 my-auto">
          {t(locale, `body.form.title`)}
        </h2>
      </div>
      <TagsBlock
        locale={locale}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        costTags={costTags}
        setCostTags={setCostTags}
      />
      <AccordionBlock
        formData={formData}
        locale={locale}
        costs={costs}
        setCosts={setCosts}
      />
    </div>
  );
};

export default MainBlock;

function defineCurrentYearData(formData: FormType): YearFormType {
  let currentYear = formData.years[CURRENT_YEAR];
  if (!currentYear) {
    const emptyMonths = initEmptyMonths();
    currentYear = {
      months: emptyMonths,
      costs: 0,
      budget: 0,
    };
  }
  return currentYear;
}

function getNewFormData(
  formData: FormType,
  currentYear: YearFormType
): FormType {
  const updatedYears = {
    ...formData.years,
    [CURRENT_YEAR]: currentYear,
  };
  const newFormData: FormType = {
    years: updatedYears,
    totalCosts: Object.values(updatedYears).reduce(
      (acc, year) => acc + year.costs,
      0
    ),
  };
  return newFormData;
}
