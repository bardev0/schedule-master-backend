import { Request, Response } from "express";
import { removeSubUser } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await removeSubUser(req.body.subUserId);
    res.json(result);
};
