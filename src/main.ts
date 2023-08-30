import { Express, Request, Response } from "express";
import express = require('express')
import cors = require("cors")

let app: Express = express()
app.use(cors())

app.get("/add")