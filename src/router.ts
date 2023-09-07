import { Router } from "express";
const debug = require("./controlers/debug")
const findMainUser = require("./controlers/findMainUser")
const validateMainUser = require("./controlers/validateMainUser")
const removeLoggedUser = require("./controlers/removeLoggedUser")
const addMainUser = require("./controlers/addMainUser")
const fetchMatrix = require("./controlers/fetchMatrix")


const router = Router()

const routes = {
    debug: "/debug",
    findMainUser: "/findMainUser",
    validateMainUser: "/validateMainUser",
    removeLoggedUser: "/removeLoggedUser",
    addMainUser: "/addMainUser",
fetchMatrix: "/fetchMatrix"
}

router.get(routes.debug, debug)
router.post(routes.findMainUser, findMainUser)
router.post(routes.validateMainUser, validateMainUser)
router.post(routes.removeLoggedUser, removeLoggedUser)
router.post(routes.addMainUser, addMainUser )
router.post(routes.fetchMatrix, fetchMatrix)

module.exports = router