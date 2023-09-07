import { Request, Response } from "express";
import { TLoginCredentials } from "../types";
import { validateLogin } from "../connection";

module.exports = async (req: Request, res: Response) => {
    const ipAddresses = req.socket.remoteAddress;
    let credentials: TLoginCredentials = req.body;
    let userStatus = await validateLogin(
        credentials.email,
        credentials.password,
        ipAddresses
    );
    res.json(userStatus);
}