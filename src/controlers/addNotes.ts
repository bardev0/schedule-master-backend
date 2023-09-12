import { Request, Response } from "express";
import { addNotes } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log("Add notes reached");
    console.log(req.body);
    let result = await addNotes({ ...req.body });
    console.log(result);
    res.json({ status: " fetched " });
};
