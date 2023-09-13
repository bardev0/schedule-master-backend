import { Request, Response } from "express";
import { removeOfffromDB } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await removeOfffromDB(req.body);
    res.json({ status: "ok" });
};
