import { Router } from "express";

export const loginRouter = Router();

loginRouter.post('/', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.status(400).send("Username or password not provided");
        return;
    }

    //login

    try {
        if (req.session.user) {
            req.session.user.username = username;
            req.session.user.password = password;
        }
        else{
            req.session.user = {
                userId: "1",
                username,
                password
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    console.log(req.session);
    console.log("Logged in");
    res.send("Logged in");
});