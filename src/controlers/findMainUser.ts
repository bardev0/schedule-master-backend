import { findUser } from "../connection";
import { Request, Response } from "express";

module.exports = async (req: Request, res: Response) => {
    // console.log(req.body);
    // console.log("app");
    const result = await findUser(req.body.id);
    res.json({ ...result });
};
