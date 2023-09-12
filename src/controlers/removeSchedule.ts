import { Request, Response } from "express";
import { removeSchedule } from "../connection";

module.exports = async (req: Request, res: Response) => {
    // console.log(req.body);
    let res1 = await removeSchedule(req.body.id, req.body.idG);
    // console.log(res1);
    res.json({ ...res1 });
};
