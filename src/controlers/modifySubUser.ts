import { Request, Response } from "express";
import { modSubUser } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await modSubUser(req.body.newSubUserData);
    res.json(result);
};
