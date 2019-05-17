import joi from "@hapi/joi";
import {
    users
} from "../models/dummy_users.js";

const key = "M1pQsurgWhwsCje8";

export function validator(req, res, next) {
    const schema = {
        email: joi.string().min(3).required(),
        password: joi.string().min(3).required(),
    };
    const result = joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send({
            message: result.error.details[0].message
        });
        return;
    }
    next();
}

export function checkIfUserExists(req, res, next){
    const users = users.find(u => u.email === req.body.email);
    if(user){
        res.status(409).send({
            message: `${user.email} exists already`
        });
        return;
    }
    next();
};