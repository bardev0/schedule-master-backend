import { Router } from "express";
import routes from "./routes";

const debug = require("./controlers/debug");
const findMainUser = require("./controlers/findMainUser");
const validateMainUser = require("./controlers/validateMainUser");
const removeLoggedUser = require("./controlers/removeLoggedUser");
const addMainUser = require("./controlers/addMainUser");
const fetchMatrix = require("./controlers/fetchMatrix");
const scheduleList = require("./controlers/scheduleList");
const removeSchedule = require("./controlers/removeSchedule");
const changeScheduleStatus = require("./controlers/changeScheduleStatus"); // FINISH
const addSchedule = require("./controlers/addSchedule");

const router = Router();

router.get(routes.debug, debug);
router.post(routes.findMainUser, findMainUser);
router.post(routes.validateMainUser, validateMainUser);
router.post(routes.removeLoggedUser, removeLoggedUser);
router.post(routes.addMainUser, addMainUser);
router.post(routes.fetchMatrix, fetchMatrix);
router.post(routes.scheduleList, scheduleList);
router.post(routes.removeSchedule, removeSchedule);
router.post(routes.changeScheduleStatus, changeScheduleStatus);
router.post(routes.addSchedule, addSchedule);

module.exports = router;
