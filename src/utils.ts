import { TDay } from "./types";

export function makeid(length: number) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}

export function returnSmartDay(num: number) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return days[num];
}

// move hardcoded year
export function shapeYearMatrix(input: Array<any>, yearInp: number) {
    let counterDays = 1;
    var smartDays = getFirstDayOfMonth(2023, 1);
    let yearId = yearInp;
    let monthId = 1;
    let shapedArray: Array<any> = [];
    for (let i = 0; i < input.length; i++) {
        let wA: Array<any> = [];

        for (let i2 = 0; i2 < input[i].length; i2++) {
            let dA: Array<any> = [];

            for (let i3 = 0; i3 < input[i][i2].length; i3++) {
                let dayName = returnSmartDay(smartDays);
                smartDays++;
                if (smartDays == 7) {
                    smartDays = 0;
                }
                let day: TDay = {
                    isWorking: true,
                    day: "active",
                    monthId: monthId,
                    yearId: yearId,
                    dayNum: input[i][i2][i3],
                    yearNum: counterDays,
                    typeOfDay: dayName,
                };
                counterDays++;
                dA.push(day);
            }

            // TO DO FIX LOGIC
            if (dA.length === 0) {
            } else if (dA.length === 7) {
            } else if (dA.length < 7 && dA[0].dayNum == 1) {
                let fillStart = 7 - dA.length;
                let fillerStart = Array.from(
                    { length: fillStart },
                    (v, idx) => {
                        day: "inactive";
                    }
                );
                fillerStart.map((a) => {
                    dA.unshift(a);
                });
            } else if (dA.length < 7 && dA[0].dayNum != 1) {
                let fillEnd = 7 - dA.length;
                let fillerEnd = Array.from({ length: fillEnd }, (v, idx) => {
                    day: "inactive";
                });
                fillerEnd.map((a) => dA.push(a));
            }

            wA.push(dA);
        }
        monthId++;
        shapedArray.push(wA);
    }
    return shapedArray;
}

/**
 * returns an array of arrays, first with offset, then chunks, and reminder
 * */
export function separate_middle_chunks(
    input: Array<any>,
    chunkSize: number,
    offset: number
): Array<any> {
    let temp = [...input];
    let returnArray: Array<any> = [];
    let firstSlice = temp.slice(0, offset);
    for (let i = 0; i < offset; i++) {
        temp.shift();
    }
    returnArray.push(firstSlice);
    while (temp.length >= chunkSize) {
        let tempPush: Array<any> = temp.slice(0, chunkSize);
        returnArray.push(tempPush);
        tempPush = [];
        for (let i = 0; i < chunkSize; i++) {
            temp.shift();
        }
    }
    returnArray.push(temp);
    return returnArray;
}

export function createOffset(dayInt: number) {
    switch (dayInt) {
        case 0:
            return 1; //good
        case 1:
            return 0; //good
        case 2:
            return 6;
        case 3:
            return 5;
        case 4:
            return 4;
        case 5:
            return 3;
        case 6:
            return 2;
        default:
            throw new Error("Wrong Params");
    }
}

export function getFirstDayOfMonth(yearInp: number, month: number): number {
    let tempDate = new Date();
    tempDate.setUTCFullYear(yearInp);
    tempDate.setMonth(month - 1);
    tempDate.setDate(1);
    return tempDate.getDay();
}

// add type check
/**
 * starting from 1
 * */
export function get_amonunt_days_month(year: number, month: number) {
    let date = new Date();
    date.setUTCFullYear(year);
    date.setMonth(month);
    date.setDate(0);
    return date.getDate();
}

export function createYearMatrix(yearNum: number) {
    let yearMatix: Array<any> = [];

    let temp_month_id = 1;
    let first_month_weeks_array = Array.from(
        { length: get_amonunt_days_month(yearNum, 0) },
        (_, index) => index + 1
    );
    let firstMonthArray = separate_middle_chunks(
        first_month_weeks_array,
        7,
        // getFirstDayOfMonth(yearNum, 1)
        createOffset(getFirstDayOfMonth(yearNum, 1))
    );
    yearMatix.push(firstMonthArray);

    for (let i = 2; i <= 12; i++) {
        let temp_month_id = i;
        let next_month = Array.from(
            { length: get_amonunt_days_month(yearNum, i) },
            (_, index) => index + 1
        );
        let deep1 = yearMatix.slice(-1);
        let deep2 = deep1.slice(-1);
        // console.log(deep2[0].length)
        let lenght_of_prev_last_array = deep2[0].length;
        let last_month_offset =
            7 - deep2[0][lenght_of_prev_last_array - 1].length;
        let next_month_weeks_array = separate_middle_chunks(
            next_month,
            7,
            last_month_offset
        );
        yearMatix.push(next_month_weeks_array);
    }

    // 3 empty array -> map over to remove them
    // yearMatix.forEach((a1:any) => a1.forEach((a2:any) => console.log(a2.length) ))
    //
    return yearMatix;
}
