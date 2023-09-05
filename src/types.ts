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

export type TRegisterData = {
    email: string;
    password: string;
    promoCode: string;
};
