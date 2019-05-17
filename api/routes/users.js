import express from "express";
import {
    validator,
    checkIfUserExists
} from "../middleware/auth.js"
import {
    adminCheck,
    addUserData,
    signedIn
} from "../controllers/UsersController";
import {
    verifyUser
} from "../middleware/users_middleware";

const router = express.Router();

router.post("/auth/signup", validator, checkIfUserExists, addUserData);

router.post("/auth/signin", signedIn);

router.patch("/:email.verify", adminCheck.verifyUser);

export default router;