import { Express, Request, Response } from "express";
import express = require("express");
import cors = require("cors");
import { TUserConsumer } from "./types";

const PORT = 2345;
let app: Express = express();
app.use(cors());
app.use(express.json());
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
];

app.get("/userList", (req, res) => {
    console.log("endpoint reached");
    res.send(tempUsers);
});

// this could be async
app.post("/findUser", (req, res) => {
    console.log(req.body);
    let userId = req.body.userId;
    let obj = tempUsers.find((o) => o.id === userId);
    console.log("obj retrived " + obj?.name + "...");
    res.send(obj);
});

app.post("/modifyUser", (req, res) => {
    let newUser = req.body
})


app.listen(PORT, () => console.log(`server started on ${PORT}`));
