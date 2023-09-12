import { Request, Response } from "express";
import { removeFromLogged } from "../connection";
module.exports = async (req: Request, res: Response) => {
    // console.log(req.body);
    const result = await removeFromLogged(req.body.userId);
    // console.log(result);
    res.json({ status: "user current login removed" });
};
