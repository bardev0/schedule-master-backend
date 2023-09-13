import { Request, Response } from "express";
import { iterateAndAddOffs } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await iterateAndAddOffs(req.body);
    res.json(result);
};
