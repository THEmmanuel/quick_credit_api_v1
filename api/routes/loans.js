import express from "express";
import {
    loanApplicationCheck,
    query
} from "../middleware/loans_middleware";
import {
    adminCheck
} from "../controllers/UsersController";
import {
    postLoan,
    viewLoanRepayments,
    approveLoan,
    rejectLoan,
    viewSpecificLoan,
    viewHistory
} from "../controllers/LoansController";
import verifier from 'express-jwt';
import {
    admin
} from "../models/dummy_users";

const tokenVerified = verifier({
    secretKey: key
});
const key = "M1pQsurgWhwsCje8";
const router = express.Router();

router.post("/", verifyToken, loanApplicationCheck, postLoan);

router.get("/:loanId/repayments", tokenVerified, viewLoanRepayments);

router.get("/", tokenVerified, adminCheck, query, viewHistory)

router.get("/loanId", tokenVerified, adminCheck, viewSpecificLoan);

router.get("/api/v1/loans?status=approved&repaid=true");

router.get("/api/v1/loans?status=approved&repaid=false");

router.patch("/:loanId/approve", tokenVerified, adminCheck, approveLoan);

router.patch("/:loanId/approve", tokenVerified, adminCheck, rejectLoan);

export default router;