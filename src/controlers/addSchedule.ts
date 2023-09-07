import { Request, Response } from "express";
import { addSchedule } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);

    let result = await addSchedule(req.body.id, req.body.start, req.body.end);
    console.log("before");
    res.json({ ...result });
    console.log("end");
};
