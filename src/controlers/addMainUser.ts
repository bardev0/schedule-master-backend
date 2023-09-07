import { Request, Response } from "express";
import { TRegisterData } from "../types";
import { addMainUser } from "../connection";

module.exports = async (req: Request, res: Response) => {
    let newData: TRegisterData = { ...req.body };
    let status = await addMainUser({ ...newData });
    console.log(status);
    res.json(status);
};
