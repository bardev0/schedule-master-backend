import { MongoClient } from "mongodb";
import { makeid } from "./utils";
// moveToEnv
let mongo_username = "greg1111";
let mongo_password = "Rgbi5QPJQCck3eox";
const URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.nsckr5l.mongodb.net/?retryWrites=true&w=majority`;
const cliet = new MongoClient(URI);
const db = cliet.db("ShiftArtist");

export async function findIfUserIsLoggedIn(id: string) {
    const col = db.collection("LoggedUsers");
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
    const col = db.collection("LoggedUsers");
    const query = col.findOneAndDelete({ id: id });
    const res = await query;
    return res;
}

export async function validateLogin(
    email: string,
    password: string,
    ip?: string
) {
    const col = db.collection("Users");
    const que = col.findOne({ email: email });
    const user = await que;
    if (user?.password == password) {
        console.log(user);
        let loginSuspensionUser = {
            id: user.id,
            dateLoggedIn: new Date(),
            ip: ip,
        };
        let isLoged = await findIfUserIsLoggedIn(user.id);
        console.log(isLoged);
        if (isLoged == false) {
            let newCol = db.collection("LoggedUsers");
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
            );
            console.log("user replaced");
        }
        // let newQ = newCol.insertO})
        return { loginStatus: "succes" };
    } else {
        return { loginStatus: "failed" };
    }
}

export async function addMainUser(
    password: string,
    email: string,
    promoCode: string
) {
    let newID = makeid(15);
    const col = db.collection("Users");
    let que = col.findOne({ email: email });
    let queId = col.findOne({ id: newID });
    let res1 = await que;
    let res2 = await queId;

    if (res1 == undefined && res2 == undefined) {
        // idz dalej
        let neqQue = col.insertOne({
            id: newID,
            email: email,
            password: password,
            promoCode: promoCode,
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
