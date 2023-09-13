import { Request, Response } from "express";
import { addSubUser } from "../connection";

module.exports = async (req: Request, res: Response) => {
    let result = await addSubUser(req.body);
    res.json(result);
};
