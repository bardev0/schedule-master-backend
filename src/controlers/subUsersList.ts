import { Request, Response } from "express";
import { fetchSubUsersList } from "../connection";

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    let result = await fetchSubUsersList(req.body.parentId);
    res.json(result);
};
