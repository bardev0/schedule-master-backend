export type TUserConsumer = {
    id: string;
    name: string;
    role: string;
    surname: string;
    email: string;
    hourly: number;
};

export type TLoginCredentials = {
    email: string;
    password: string;
    ipAdress?: string;
};

export type TMainUserData = TLoginCredentials & {
    firstLogin: boolean
}

export type TRegisterData = {
    email: string;
    password: string;
    promoCode: string;
    companyName: string;
};

export type TDay = {
    note? : string
    actualShifts?: Array<any>;
    isWorking: boolean;
    proposedShifts?: Array<any>
    offs?: Array<any>;
    day: string;
    dayNum: number;
    monthId: number;
    typeOfDay: string;
    yearId: number;
    yearNum: number;
};

export type TModShiftObj = {
    user: string,
    days: Array<{user: string, location: string}>
}

export type TShiftModData = {
    user:string,
    location: string
}