import { Request, Response } from "express";
import { removeProposedShiftfromDB } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await removeProposedShiftfromDB(req.body);
    res.json(result);
};
