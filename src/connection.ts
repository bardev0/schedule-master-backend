import { MongoClient } from "mongodb";
import { makeid, createYearMatrix, shapeYearMatrix } from "./utils";
import { TRegisterData } from "./types";
import { TGrafik } from "./types";
// moveToEnv
let mongo_username = "greg1111";
let mongo_password = "Rgbi5QPJQCck3eox";
const URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.nsckr5l.mongodb.net/?retryWrites=true&w=majority`;
const cliet = new MongoClient(URI);
const db = cliet.db("ShiftArtist");

const allCol = {
    loggedUsers: "LoggedUsers",
    users: "Users",
    userData: "UserData",
};

export async function removeSchedule(id: string, grafikIndex: number) {
    const col = db.collection(allCol.userData);
    const querry = col.findOne({ id: id });
    const data = await querry;
    const grafiki = data?.schedules.default;
    let index = grafiki.findIndex((e: any) => e.id === grafikIndex);
    grafiki.splice(index, 1);
    const filter = { id: id };
    const replacement = { default: grafiki };
    const update = { $set: { schedules: replacement } };
    const result2 = await col.updateOne(filter, update);
    return result2;
}

export async function addSchedule(id: string, start: any, end: any) {
    const col = db.collection(allCol.userData);
    const que = col.findOne({ id: id });
    const res = await que;
    console.log(res);
    let lastIdOfG;
    if (res == null) {
    } else {
        console.log(res);
        if (res?.schedules.default.length == 0) {
            lastIdOfG = 1;
        } else {
            //debug
            // console.log(res.schedules.default)
            // console.log(res.schedules.default.length)
            lastIdOfG =
                res.schedules.default[res.schedules.default.length - 1].id + 1;
        }
        let newG: TGrafik = {
            id: lastIdOfG,
            status: "active",
            start: new Date(start),
            end: new Date(end),
        };
        let copy = [...res.schedules.default];
        copy.push(newG);
        const filter = { id: id };
        const replacement = { default: copy };
        const update = { $set: { schedules: replacement } };
        const que2 = await col.updateOne(filter, update);
        return que2;
    }
}

/// Finish
export async function changeScheduleStatus(id: string, grafikIndex: number) {
    const col = db.collection(allCol.userData);
    const que = col.findOne({ id: id });
    const res = await que;
    let grafiki = res?.scheadules.default;
    let index = grafiki.findIndex((e: any) => e.id === grafikIndex);
    console.log(grafiki[index]);
    const filer = { id: id };
    let replacement;
}

export async function changeFirstLoginStatus(id: string) {
    const col = db.collection(allCol.users);
    const filter = { id: id };
    const update = { $set: { hasLoggedIn: true } };
    const result = await col.updateOne(filter, update);
    return result;
    // const que2
}

export async function grabScheduleList(id: string) {
    const col = db.collection(allCol.userData);
    const querry = col.findOne({ id: id });
    const result = await querry;
    return result?.schedules;
}

export async function createBlancMatrix(id: string) {
    let currYear = new Date().getFullYear();
    let tenYmatrix: any = {};
    for (let i = currYear; i < currYear + 10; i++) {
        console.log(i);
        let oneYarray = shapeYearMatrix(createYearMatrix(i), i);
        tenYmatrix[i] = oneYarray;
    }
    const col = db.collection(allCol.userData);
    let allUserGrafikData = {
        id: id,
        data: tenYmatrix,
        schedules: {
            default: [],
        },
    };
    const q = col.insertOne({ ...allUserGrafikData });
    const result = await q;

    return { data: allUserGrafikData, result: result };
}

export async function findUser(id: string) {
    const col = db.collection(allCol.users);
    const que = col.findOne({ id: id });
    const res = await que;
    return { ...res };
}

export async function fetchUserData(id: string) {
    const col = db.collection(allCol.userData);
    const querry = col.findOne({ id: id });
    const result = await querry;
    console.log(result);
    return result;
}

export async function findIfUserIsLoggedIn(id: string) {
    const col = db.collection(allCol.loggedUsers);
    const query = col.findOne({ id: id });
    const res = await query;
    console.log(res);
    if (res === null) {
        return false;
    } else {
        return true;
    }
}

export async function removeFromLogged(id: string) {
    const col = db.collection(allCol.loggedUsers);
    const query = col.findOneAndDelete({ id: id });
    const res = await query;
    return res;
}

export async function validateLogin(
    email: string,
    password: string,
    ip?: string
) {
    const col = db.collection(allCol.users);
    const que = col.findOne({ email: email });
    const user = await que;
    if (user?.password == password) {
        console.log(user);
        let isLoged = await findIfUserIsLoggedIn(user.id);
        console.log(isLoged);
        if (isLoged == false) {
            let newCol = db.collection(allCol.loggedUsers);
            let res = newCol.insertOne({
                id: user.id,
                dateLoggedIn: new Date(),
                ip: ip,
            });
            console.log("user add to logged users +" + res);
        } else {
            let col = db.collection("LoggedUsers");
            col.findOneAndReplace(
                { id: user.id },
                { id: user.id, dateLoggedIn: new Date(), ip: ip }
                // add valid login date + 1,5 month
            );
            console.log("user replaced");
        }
        // let newQ = newCol.insertO})
        return { status: "succes", id: user.id };
    } else {
        return { status: "failed" };
    }
}

export async function addMainUser(ob: TRegisterData) {
    let data: TRegisterData = { ...ob };
    let newID = makeid(15);
    const col = db.collection("Users");
    let que = col.findOne({ email: data.email });
    let queId = col.findOne({ id: newID });
    let res1 = await que;
    let res2 = await queId;

    if (res1 == undefined && res2 == undefined) {
        // idz dalej
        let neqQue = col.insertOne({
            id: newID,
            email: data.email,
            password: data.password,
            promoCode: data.promoCode,
            companyName: data.companyName,
            hasLoggedIn: false,
        });
        let res = await neqQue;
        if (res.acknowledged == true) {
            return { registerStatus: "succes" };
        } else {
            return { registerStatus: "database error" };
        }
    } else {
        return { registerStatus: "error // email already in use" };
    }
}
