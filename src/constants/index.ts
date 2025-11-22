import { Month } from "@/lib/types/dataTypes";

export const MONTHS: Record<number, string> = {
  1: "january",
  2: "february",
  3: "march",
  4: "april",
  5: "may",
  6: "june",
  7: "july",
  8: "august",
  9: "september",
  10: "october",
  11: "november",
  12: "december",
};

export const EMPTY_FORM_MONTHS: Month[] = [
  { id: 1, title: "january", records: [], totalAmount: 0 },
  {
    id: 2,
    title: "february",
    records: [],
    totalAmount: 0,
  },
  { id: 3, title: "march", records: [], totalAmount: 0 },
  { id: 4, title: "april", records: [], totalAmount: 0 },
  { id: 5, title: "may", records: [], totalAmount: 0 },
  { id: 6, title: "june", records: [], totalAmount: 0 },
  { id: 7, title: "july", records: [], totalAmount: 0 },
  { id: 8, title: "august", records: [], totalAmount: 0 },
  {
    id: 9,
    title: "september",
    records: [],
    totalAmount: 0,
  },
  {
    id: 10,
    title: "october",
    records: [],
    totalAmount: 0,
  },
  {
    id: 11,
    title: "november",
    records: [],
    totalAmount: 0,
  },
  {
    id: 12,
    title: "december",
    records: [],
    totalAmount: 0,
  },
];

export const BASE_URL = "https://expenses-tracker-shilkov.vercel.app/";
export const CURRENT_YEAR = new Date().getFullYear();

export const AMOUNT_REGEX = /^0+|[^\d.+\-*/=]+|[^\d]+$/g;
export const OP_REGEX = /(?:\d+\.\d+|\d+\.|\.\d+|\d+)|[+\-*/]/g;

export const TRACKER_IDS = "trackerIds";
export const METADATA_STORE = "MetadataStore";
export const TAGS_STORE = "TagsStore";
export const RECORDS_STORE = "RecordsStore";
