import { Year } from "@/lib/types/dataTypes";
import { CURRENT_YEAR } from "../../constants";
import { initEmptyMonths } from "./monthHelper";

export function initEmptyTracker(trackerType: string) {
    return {
        id: trackerType,
        years: [
            {
                id: CURRENT_YEAR,
                months: initEmptyMonths(),
                totalAmount: 0,
            },
        ] as Year[],
        totalAmount: 0,
    }
}