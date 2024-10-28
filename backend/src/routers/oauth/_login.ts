import { Router } from "express";

export const loginRouter = Router();

loginRouter.get('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //login

    try {
        if (req.session.user) {
            req.session.user.username = username;
            req.session.user.password = password;
        }
    }
    catch (err) {
        console.log(err);
    }

    res.send("Logged in");
});