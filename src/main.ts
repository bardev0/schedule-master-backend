import { Express, Request, Response } from "express";
import express = require("express");
import cors = require("cors");
import { TLoginCredentials, TRegisterData, TUserConsumer } from "./types";
import { TNotesObj } from "../../grafik/src/utils/types";
import { makeid } from "./utils";
import { createYearMatrix, shapeYearMatrix } from "./utils"

import { addMainUser, changeFirstLoginStatus, createBlancMatrix, fetchUserData, findUser, removeFromLogged, validateLogin } from "./connection";

const PORT = 2345;
let app: Express = express();
app.use(cors());
app.use(express.json());

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

let tempUsers: Array<TUserConsumer> = [
    {
        name: "greg",
        role: "admin",
        email: "temp@email.com",
        hourly: 1000,
        surname: "dabr",
        id: "324fdss8883",
    },
    {
        name: "tymon",
        role: "consumer",
        email: "tymon@gmail.com",
        hourly: 200,
        surname: "strab",
        id: "432iiiOd_32",
    },
    {
        name: "Allegro",
        role: "consumer",
        email: "allegro@gmail.com",
        hourly: 232,
        surname: "Client",
        id: "7778888_ghz",
    },
];

export type TGrafik = {
    id: number;
    status: "active" | "closed";
    start: Date;
    end: Date;
};

let exampleListGrafikow: Array<TGrafik> = [
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

app.post("/findMainUser", async (req, res) => {
    console.log(req.body)
    console.log("app")
    const result = await findUser(req.body.id)
    res.json({...result})
})

app.post("/debug", async (req, res) => {
    console.log(req.body)
    let data = await findUser(req.body.id)
    res.json(data)
})


// ip adress jest ipv6
app.post("/validateMainUser", async (req, res) => {
    const ipAddresses = req.socket.remoteAddress;
    let credentials: TLoginCredentials = req.body;
    let userStatus = await validateLogin(
        credentials.email,
        credentials.password,
        ipAddresses
    );
    res.json(userStatus);
});

app.post("/removeLoggedUser", async (req, res) => {
    console.log(req.body);
    const result = await removeFromLogged(req.body.userId);
    console.log(result);
    res.json({ status: "user current login removed" });
});

app.post("/addMainUser", async (req, res) => {

    let newData: TRegisterData = {...req.body}
    let status = await addMainUser({...newData});
    console.log(status);
    res.json(status);
});

app.post("/fetchMatrix", async (req, res) => {
    console.log(req.body)
    if ((await findUser(req.body.id)).hasLoggedIn == false) {
        createBlancMatrix(req.body.id)
        changeFirstLoginStatus(req.body.id)
        let data = await fetchUserData(req.body.id)
        res.json({...data})
    } else {
        let data = await fetchUserData(req.body.id)
        console.log("był zalogowany")
        res.json({...data})

    }
});
// Everything below to redo

app.get("/scheaduleList", (req, res) => {
    console.log(req.body);
    res.json(exampleListGrafikow);
});

app.post("/changeStatus", (req, res) => {
    let index = exampleListGrafikow.findIndex((e) => e.id == req.body.idG);
    exampleListGrafikow[index].status = "closed";
    res.json({ status: "ok" });
});

app.post("/addSchedule", (req, res) => {
    let lastIdOfG;
    if (exampleListGrafikow.length == 0) {
        lastIdOfG = 1;
    } else {
        lastIdOfG = exampleListGrafikow[exampleListGrafikow.length - 1].id + 1;
    }
    let newG: TGrafik = {
        id: lastIdOfG,
        status: "active",
        start: new Date(req.body.start),
        end: new Date(req.body.end),
    };
    console.log(newG);
    exampleListGrafikow.push(newG);
    res.json(newG);
});

app.post("/addNotes", (req, res) => {
    console.log("add notes reached");
    let rdata: TNotesObj = req.body;
    console.log(rdata);
    let date = new Date(rdata.date);
    let monthIdx = date.getMonth();
    // console.log(mainUserArray[0][monthIdx])
    mainUserArray[0][monthIdx].map((element: any) =>
        element.map((day: any) => {
            if (day !== undefined) {
                if (day.yearNum == getNumberOfDay(date) + 1) {
                    day.note = rdata.note;
                    console.log(day);
                }
            }
        })
    );
    res.json({ statsu: "ok" });
});

// convert to post for status return
app.get("/convertShiftsToActive", (req, res) => {
    let lastGrafik = exampleListGrafikow[exampleListGrafikow.length - 1];
    let datesArray: Array<Date> = [];
    console.log(lastGrafik);
    if (lastGrafik.status !== "active") {
        res.json({ status: "ostatni grafik nie jest juz aktywny" });
    } else {
        for (
            let startingDate = lastGrafik.start;
            startingDate <= lastGrafik.end;
            startingDate.setDate(startingDate.getDate() + 1)
        ) {
            datesArray.push(new Date(startingDate));
        }
    }
    // console.log(datesArray) -> works!
    datesArray.map((date) => {
        mainUserArray[0][date.getMonth()].map((week: any) => {
            week.map((day: any) => {
                if (day !== undefined) {
                    if (day.yearNum == getNumberOfDay(date)) {
                        if (day.proposedShifts !== undefined) {
                            let clones = [...day.proposedShifts];
                            console.log(clones);
                            day.proposedShifts = undefined;
                            day.actualShifts = [...clones];
                        }
                    }
                }
            });
        });
    });
});

app.post("/removeSchedule", (req, res) => {
    console.log(req.body);
    let index = exampleListGrafikow.findIndex((e) => e.id === req.body.idG);
    exampleListGrafikow.splice(index, 1);
    res.json({ status: "ok" });
});
app.post("/convertShiftsPtoA", (req, res) => {
    console.log(req.body);
    let testOb = {
        start: "data",
        end: "data",
    };
    res.json({ status: "ok" });
});

app.get("/userList", (req, res) => {
    console.log("endpoint reached");
    res.send(tempUsers);
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
// function modArray(req, dest) {}

app.post("/addOffs", (req, res) => {
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
                            if (day.offs !== undefined) {
                                cloneOffs = [...day.offs];
                                cloneOffs.push(offObj);
                                day.offs = cloneOffs;
                            } else {
                                day.offs = [];
                                day.offs.push(offObj);
                            }

                            console.log(day);
                        }
                    }
                });
            });
        }
    });
    // req.body.days.forEach((element: any) => {
    //     let tDate = new Date(element)
    //     console.log(tDate.getMonth())
    //     //
    // });
    // array of all dates to change
    res.json({ status: "ok" });
});

// this could be async
app.post("/findUser", (req, res) => {
    let userId = req.body.userId;
    let obj = tempUsers.find((o) => o.id === userId);
    res.json(obj);
});

app.post("/modifyUser", (req, res) => {
    let index = tempUsers.findIndex((e) => e.id === req.body.id);
    console.log(index);
    tempUsers.splice(index, 1);
    tempUsers.push(req.body);
    res.json({ type: "ok" });
});

app.post("/addUser", (req, res) => {
    console.log(req.body);
    let newU = req.body;
    let newId = makeid(12);
    // check if id is not used
    newU.id = newId;
    tempUsers.push(newU);
});

app.post("/removeUser", (req, res) => {
    console.log("remove reached");
    let index = tempUsers.findIndex((e) => e.id === req.body.userId);
    tempUsers.splice(index, 1);
    res.json({ result: true });
});

app.listen(PORT, () => console.log(`server started on ${PORT}`));
