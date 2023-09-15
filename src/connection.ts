import { MongoClient } from "mongodb";
import { makeid, createYearMatrix, shapeYearMatrix } from "./utils";
import { TRegisterData } from "./types";
import { TGrafik } from "./types";
import dotenv = require("dotenv");
import * as bcrypt from "bcrypt"

dotenv.config();
let mongo_username = process.env.MONGOUSER;
let mongo_password = process.env.MONGOPASS;
const URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.nsckr5l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(URI);
const db = client.db("ShiftArtist");

const allCol = {
    loggedUsers: "LoggedUsers",
    users: "Users",
    userData: "UserData",
    subUsers: "SubUsers",
};

function removeProposedShift(user: any, dayObj: any) {
    if (dayObj.proposedShifts == undefined) {
    } else {
        let tproposedShifts = [...dayObj.proposedShifts];
        let index = tproposedShifts.findIndex((e) => e == user);
        tproposedShifts.splice(index, 1);

        dayObj.proposedShifts = tproposedShifts;
    }
}

function addPropsedShift(user: any, dayObj: any) {
    let singlePShift = {
        user: user,
    };
    if (dayObj.proposedShifts == undefined) {
        dayObj.proposedShifts = [];
        dayObj.proposedShifts.push(singlePShift);
    } else {
        let tproposedShifts = [...dayObj.proposedShifts];
        tproposedShifts.push(singlePShift);
        dayObj.proposedShifts = tproposedShifts;
    }
}
export async function removeProposedShiftfromDB(data: any) {
    // find main user
    const col = db.collection(allCol.subUsers);
    const q1 = await col.findOne({ id: data.user });
    let parentUser = q1?.parent;
    // access matrix
    const col2 = db.collection(allCol.userData);
    const q2 = await col2.findOne({ id: parentUser });

    if (q2 !== null) {
        data.days.map((date: any) => {
            let temp = modObj(q2?.data, date, "removeProposedShift", data.user);
            q2.data = temp;
        });
        const q3 = await col2.findOneAndUpdate(
            { id: parentUser },
            { $set: { data: q2.data } }
        );
        return q3;
    }
    // let newO = modObj(q2?.data, "2023-01-01T00:00:00.000Z", "czyMTestieWiezi", true);
}

export async function addProposedShiftToDB(data: any) {
    // find main user
    const col = db.collection(allCol.subUsers);
    const q1 = await col.findOne({ id: data.user });
    let parentUser = q1?.parent;
    // access matrix
    const col2 = db.collection(allCol.userData);
    const q2 = await col2.findOne({ id: parentUser });

    if (q2 !== null) {
        data.days.map((date: any) => {
            let temp = modObj(q2?.data, date, "addProposedShift", data.user);
            q2.data = temp;
        });
        const q3 = await col2.findOneAndUpdate(
            { id: parentUser },
            { $set: { data: q2.data } }
        );
        return q3;
    }
    // let newO = modObj(q2?.data, "2023-01-01T00:00:00.000Z", "czyMTestieWiezi", true);
}

function addOff(user: any, dayObj: any) {
    let singleOff = {
        user: user,
    };
    if (dayObj.offs == undefined) {
        dayObj.offs = [];
        dayObj.offs.push(singleOff);
    } else {
        let tOffs = [...dayObj.offs];
        tOffs.push(singleOff);
        dayObj.offs = tOffs;
    }
}

function removeOff(user: any, dayObj: any) {
    if (dayObj.offs == undefined) {
    } else {
        let tOffs = [...dayObj.offs];
        let index = tOffs.findIndex((e) => e == user);
        tOffs.splice(index, 1);

        dayObj.offs = tOffs;
    }
}

export async function removeOfffromDB(data: any) {
    // find main user
    const col = db.collection(allCol.subUsers);
    const q1 = await col.findOne({ id: data.user });
    let parentUser = q1?.parent;
    // access matrix
    const col2 = db.collection(allCol.userData);
    const q2 = await col2.findOne({ id: parentUser });

    if (q2 !== null) {
        data.days.map((date: any) => {
            console.log(date);
            let temp = modObj(q2?.data, date, "removeOffs", data.user);
            q2.data = temp;
        });
        const q3 = await col2.findOneAndUpdate(
            { id: parentUser },
            { $set: { data: q2.data } }
        );
        return q3;
    }
    // let newO = modObj(q2?.data, "2023-01-01T00:00:00.000Z", "czyMTestieWiezi", true);
}

type logicParams =
    | "addOffs"
    | "removeOffs"
    | "addProposedShift"
    | "removeProposedShift";

function modObj(
    obj: any,
    dateToMod: any,
    logicToExec: logicParams,
    user: string,
    addParams?: any
) {
    let czas = new Date(dateToMod);
    console.log(czas);
    const tempYear: any = [];
    obj[czas.getFullYear()].map((months: any, idx: number) => {
        let mA: Array<any> = [];

        if (idx == czas.getMonth()) {
            months.map((week: any) => {
                let wA: Array<any> = [];
                week.map((day: any) => {
                    if (day == null) {
                        wA.push(day);
                    } else if (day.dayNum == czas.getDate()) {
                        switch (logicToExec) {
                            case "addOffs":
                                addOff(user, day);
                                break;
                            case "removeOffs": {
                                removeOff(user, day);
                                break;
                            }
                            case "addProposedShift": {
                                addPropsedShift(user, day);
                                break;
                            }
                            case "removeProposedShift": {
                                removeProposedShift(user, day);
                            }
                            default: {
                            }
                        }

                        wA.push(day);
                    } else {
                        wA.push(day);
                    }
                });
                mA.push(wA);
            });
        } else {
            months.map((week: any) => {
                let wA: Array<any> = [];
                week.map((day: any) => {
                    wA.push(day);
                });
                mA.push(wA);
            });
        }
        tempYear.push(mA);
    });

    obj[czas.getFullYear()] = tempYear;
    return obj;
}

export async function iterateAndAddOffs(data: any) {
    // find main user
    const col = db.collection(allCol.subUsers);
    const q1 = await col.findOne({ id: data.user });
    let parentUser = q1?.parent;
    // access matrix
    const col2 = db.collection(allCol.userData);
    const q2 = await col2.findOne({ id: parentUser });

    if (q2 !== null) {
        data.days.map((date: any) => {
            console.log(date);
            let temp = modObj(q2?.data, date, "addOffs", data.user);
            q2.data = temp;
        });
        const q3 = await col2.findOneAndUpdate(
            { id: parentUser },
            { $set: { data: q2.data } }
        );
        return q3;
    }
    // let newO = modObj(q2?.data, "2023-01-01T00:00:00.000Z", "czyMTestieWiezi", true);
}

export async function modSubUser(newUser: any) {
    const col = db.collection(allCol.subUsers);
    const que = await col.findOneAndReplace({ id: newUser.id }, newUser);
    console.log(que);
    return que;
}

export async function findSingleSubUser(subUserId: string) {
    const col = db.collection(allCol.subUsers);
    const que = await col.findOne({ id: subUserId });
    return que;
}

export async function fetchSubUsersList(parentId: string) {
    const col = db.collection(allCol.subUsers);
    const que = await col.find({ parent: parentId }).toArray();
    return que;
}

export async function removeSubUser(rmUserId: any) {
    const col = db.collection(allCol.subUsers);
    const que = await col.findOneAndDelete({ id: rmUserId });
    return que;
}

export async function addSubUser(userObj: any) {
    // check if sub user exists
    const col = db.collection(allCol.subUsers);
    const newSubUser = { ...userObj };
    newSubUser.id = makeid(15);
    const que = await col.insertOne(newSubUser);
    return que;
}

export async function addNotes(opt: any) {
    console.log(opt);
    const col = db.collection(allCol.userData);
    const q = await col.findOne({ id: opt.id });
    let dateTemp = new Date(opt.date);
    // const justData = q?.data
    const year = q?.data[dateTemp.getFullYear()];

    const tempYear: Array<any> = [];
    year.map((months: any, idx: number) => {
        let mA: Array<any> = [];

        if (idx == dateTemp.getMonth()) {
            months.map((week: any) => {
                let wA: Array<any> = [];
                week.map((day: any) => {
                    if (day == null) {
                        wA.push(day);
                    } else if (day.dayNum == opt.dayNum) {
                        day.note = opt.note;
                        console.log(day);
                        wA.push(day);
                    } else {
                        wA.push(day);
                    }
                });
                mA.push(wA);
            });
        } else {
            months.map((week: any) => {
                let wA: Array<any> = [];
                week.map((day: any) => {
                    wA.push(day);
                });
                mA.push(wA);
            });
        }
        tempYear.push(mA);
    });
    console.log(tempYear);
    let filter = { id: opt.id };
    // justData[dateTemp.getFullYear()] = tempYear
    let obj: any = {};
    obj[`data.${dateTemp.getFullYear()}`] = tempYear;
    console.log(obj);
    let q2 = await col.updateOne(filter, { $set: obj });
    console.log(q2);
}
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
    // console.log(res);
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
    // console.log(grafiki[index]);
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
        // console.log(i);
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
    // console.log(result);
    return result;
}

export async function findIfUserIsLoggedIn(id: string) {
    const col = db.collection(allCol.loggedUsers);
    const query = col.findOne({ id: id });
    const res = await query;
    // console.log(res);
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

    console.log(user?.password)
    console.log(password)
    let comp = await bcrypt.compare(password, user?.password)
    
    console.log(comp)
    if (comp) {
        // console.log(user);
        let isLoged = await findIfUserIsLoggedIn(user?.id);
        // console.log(isLoged);
        if (isLoged == false) {
            let newCol = db.collection(allCol.loggedUsers);
            let res = newCol.insertOne({
                id: user?.id,
                dateLoggedIn: new Date(),
                ip: ip,
            });
            // console.log("user add to logged users +" + res);
        } else {
            let col = db.collection("LoggedUsers");
            col.findOneAndReplace(
                { id: user?.id },
                { id: user?.id, dateLoggedIn: new Date(), ip: ip }
                // add valid login date + 1,5 month
            );
            // console.log("user replaced");
        }
        // let newQ = newCol.insertO})
        return { status: "succes", id: user?.id };
    } else {
        return { status: "wrong password" };
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
