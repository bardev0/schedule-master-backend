import { Express, Request, Response } from "express";
import express = require("express");
import cors = require("cors");
import { TUserConsumer } from "./types";
import { makeid } from "./utils";
import { createYearMatrix, shapeYearMatrix} from "../../grafik-src/utils"
const PORT = 2345;
let app: Express = express();
app.use(cors());
app.use(express.json());
let data = createYearMatrix(2023);
let matrix = shapeYearMatrix(data, 2023);

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

app.get("/userList", (req, res) => {
    console.log("endpoint reached");
    res.send(tempUsers);
});

// this could be async
app.post("/findUser", (req, res) => {
    // console.log(req.body);
    let userId = req.body.userId;
    let obj = tempUsers.find((o) => o.id === userId);
    // console.log(obj);
    res.json(obj);
});

app.post("/modifyUser", (req, res) => {
    let index = tempUsers.findIndex((e) => e.id === req.body.id);
    console.log(index);
    tempUsers.splice(index, 1);
    tempUsers.push(req.body);
    // console.log(req.body);
    res.json({ type: "ok" });
});

app.post("/addUser", (req, res) => {
    console.log(req.body);
    let newU = req.body;
    let newId = makeid(12);
    // check if id is not used
    newU.id = newId;
    console.log(newU);
    tempUsers.push(newU);
});

app.post("/removeUser", (req, res) => {
    console.log("remove reached");
    let index = tempUsers.findIndex((e) => e.id === req.body.userId);
    console.log(req.body.userId);
    console.log(index);
    console.log(tempUsers.length);
    tempUsers.splice(index, 1);
    res.json({ result: true });
});
app.listen(PORT, () => console.log(`server started on ${PORT}`));
