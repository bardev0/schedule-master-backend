import { Request, Response } from "express";
import { findSingleSubUser } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body.subUserId);
    let result = await findSingleSubUser(req.body.subUserId);
    res.json(result);
};
