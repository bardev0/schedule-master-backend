import { Express } from "express";
import express = require("express");
import cors = require("cors");
import { TUserConsumer } from "./types";
import { createYearMatrix, shapeYearMatrix } from "./utils";
import dotenv = require("dotenv")
const router = require("./router");

dotenv.config()

const PORT = process.env.PORT 
let app: Express = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const getNumberOfDay = (dateToCalculate: Date) => {
    let firstDay = new Date(dateToCalculate.getFullYear(), 0, 0);
    let numberOfDays = Math.floor(
        (dateToCalculate.getTime() - firstDay.getTime()) / 1000 / 60 / 60 / 24
    );
    return numberOfDays;
};

// create field daysPast in main Array, and update it every login

// when user registers create a empty mainUserArray
// when user logs in fetch an existing one with user id

let mainUserArray: Array<any> = [];
let data = createYearMatrix(2023);
let matrix = shapeYearMatrix(data, 2023);
mainUserArray.push(matrix);

app.post("/convertShiftsPtoA", (req, res) => {
    console.log(req.body);
    let testOb = {
        start: "data",
        end: "data",
    };
    res.json({ status: "ok" });
});

app.post("/addProposedShift", (req, res) => {
    console.log(req.body);
    let userToChange = req.body.user;
    let teraz = new Date();
    req.body.days.map((element: any) => {
        let offObj = {
            user: userToChange,
            location: element,
        };
        if (element == undefined) {
        } else {
            let tDate = new Date(element);
            let elemNum = getNumberOfDay(tDate);

            // [0] oznacza 2023, dodac info o roku do wyszukiwania
            mainUserArray[0][tDate.getMonth()].map((week: any) => {
                week.map((day: any) => {
                    if (day !== undefined) {
                        if (day.yearNum == elemNum) {
                            // console.log(day)
                            let cloneOffs = [];
                            if (day.proposedShifts !== undefined) {
                                cloneOffs = [...day.proposedShifts];
                                cloneOffs.push(offObj);
                                day.proposedShifts = cloneOffs;
                            } else {
                                day.proposedShifts = [];
                                day.proposedShifts.push(offObj);
                            }

                            console.log(day);
                        }
                    }
                });
            });
        }
    });
});

// app.post("/addOffs", (req, res) => {
//     console.log(req.body);
//     let userToChange = req.body.user;
//     let teraz = new Date();
//     req.body.days.map((element: any) => {
//         let offObj = {
//             user: userToChange,
//             location: element,
//         };
//         if (element == undefined) {
//         } else {
//             let tDate = new Date(element);
//             let elemNum = getNumberOfDay(tDate);

//             // [0] oznacza 2023, dodac info o roku do wyszukiwania
//             mainUserArray[0][tDate.getMonth()].map((week: any) => {
//                 week.map((day: any) => {
//                     if (day !== undefined) {
//                         if (day.yearNum == elemNum) {
//                             // console.log(day)
//                             let cloneOffs = [];
//                             if (day.offs !== undefined) {
//                                 cloneOffs = [...day.offs];
//                                 cloneOffs.push(offObj);
//                                 day.offs = cloneOffs;
//                             } else {
//                                 day.offs = [];
//                                 day.offs.push(offObj);
//                             }

//                             console.log(day);
//                         }
//                     }
//                 });
//             });
//         }
//     });
//     // req.body.days.forEach((element: any) => {
//     //     let tDate = new Date(element)
//     //     console.log(tDate.getMonth())
//     //     //
//     // });
//     // array of all dates to change
//     res.json({ status: "ok" });
// });

app.listen(PORT, () => console.log(`server started on ${PORT}`));
