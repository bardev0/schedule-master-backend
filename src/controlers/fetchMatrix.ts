import { Request, Response } from "express";
import {
    findUser,
    createBlancMatrix,
    changeFirstLoginStatus,
    fetchUserData,
} from "../connection";

// app.post("/fetchMatrix",

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    if ((await findUser(req.body.id)).hasLoggedIn == false) {
        createBlancMatrix(req.body.id);
        changeFirstLoginStatus(req.body.id);
        let data = await fetchUserData(req.body.id);
        res.json({ ...data });
    } else {
        let data = await fetchUserData(req.body.id);
        console.log("był zalogowany");
        res.json({ ...data });
    }
};
