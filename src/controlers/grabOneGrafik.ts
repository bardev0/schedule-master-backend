import { Request, Response } from "express";
import { grabOneGrafik } from "../connection";

import { GrafkBody } from "../../../grafik/src/utils/types"
module.exports = async (req: Request, res: Response) => {
    console.log(req.body)
    let data: GrafkBody = req.body
    grabOneGrafik(data)
    res.json({ok : true})
}