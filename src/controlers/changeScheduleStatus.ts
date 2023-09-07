import { Request, Response } from "express";
import { changeScheduleStatus } from "../connection";
module.exports = async (req: Request, res: Response) => {
    res.json("ok");
};
