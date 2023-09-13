import { Request, Response } from "express";
import { addProposedShiftToDB } from "../connection";
module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await addProposedShiftToDB(req.body);
    res.json(result);
};
