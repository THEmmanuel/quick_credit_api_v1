import {
    users
} from "../models/dummy_users.js";

export function verifyUser(req, res) {
    const user = users.find(u => u.email === req.params.email);
    if (!user) {
        res.status(404).send({
            error: 404,
            message: `${req.params.email} not found`
        });
        return;
    }
    user.status = "verified";
    res.send(user);
};