import { Request, Response } from "express"

module.exports = (req: Request, res: Response) => {
    res.json({status: "debug"})
}