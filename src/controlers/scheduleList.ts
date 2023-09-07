import { Request, Response } from "express";
import { grabScheduleList } from "../connection";

let exampleListGrafikow = [
    {
        id: 1,
        status: "closed",
        start: new Date("2023-01-01"),
        end: new Date("2023-05-11"),
    },
    {
        id: 2,
        status: "closed",
        start: new Date("2023-05-12"),
        end: new Date("2023-08-31"),
    },
    {
        id: 3,
        status: "closed",
        start: new Date("2023-09-01"),
        end: new Date("2023-12-31"),
    },
];

module.exports = async (req: Request, res: Response) => {
    console.log(req.body);
    res.json(await grabScheduleList(req.body.id));
};
