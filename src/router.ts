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
const addNotes = require("./controlers/addNotes");
const addSubUser = require("./controlers/addSubUser");
const removeSubUser = require("./controlers/removeSubUser");
const subUsersList = require("./controlers/subUsersList");
const findSingleSubUser = require("./controlers/findSingleSubUser");
const modifySubUser = require("./controlers/modifySubUser");
const addOffs = require("./controlers/addOffs");
const removeOffs = require("./controlers/removeOffs");
const addPropsedShifts = require("./controlers/addProposedShift");
const removeProposedShifts = require("./controlers/removeProposedShift");
const grabOneGrafik = require("./controlers/grabOneGrafik")
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
router.post(routes.addNotes, addNotes);
router.post(routes.addSubUser, addSubUser);
router.post(routes.removeSubUser, removeSubUser);
router.post(routes.subUsersList, subUsersList);
router.post(routes.findSingleSubUser, findSingleSubUser);
router.post(routes.modifySubUser, modifySubUser);
router.post(routes.addOffs, addOffs);
router.post(routes.removeOffs, removeOffs);
router.post(routes.addProposedShifts, addPropsedShifts);
router.post(routes.removeProposedShifts, removeProposedShifts);
router.post(routes.grabOneGrafik, grabOneGrafik)
module.exports = router;
