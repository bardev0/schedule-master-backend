import { Request, Response } from "express";
import { addOffs } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await addOffs(req.body);
    res.json(result);
};
