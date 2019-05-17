import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";
import short_id from "short-uuid";
import {users} from "../models/dummy_users.js";
const key = "M1pQsurgWhwsCje8";

export function adminCheck (req, res, next){
    const token = req.headers.authorization;
    const decodedToken = jwt_decode(token);
    const admin = users.find(u => u.email === decodedToken.email);
    if(!admin || admin.isAdmin === false){
        res.status(403).send({error : 403, message: "forbidden, user is not an admin"});
        return;
    };
    next();
};

export function addUserData(res, req){
    const token = jwt.sign({email: req.body.email}, key, {expiresIn: "2h"});

    const user = {
        id: short_id.generate(), 
        token, 
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
    };
    users.push(user);
    res.status(201).send(user);
}

export function signedIn(res, req){
    const token = jwt.sign({email: req.body.email}, key, {expiresIn: "2h"});
    const user = users.find(u => u.email === req.body.email);
    if(!user || user.password !== req.body.password){
        res.status(401).send({message: "User password or email incorrect"});
        return;
    }
    user.token = token;
    res.status(200).send(user); 
}