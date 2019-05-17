import {
    loans
} from "../models/dummy_loans";

export function loanApplicationCheck(req, res, next) {
    const loan = loans.find(a => a.user === req.body.user);
    if (loan) {
        res.status(409).send({
            message: "You can not request for a loan at this time because you have requested for a loan previously"
        });
        return;
    }
    next();
}

export function query(req, res, next) {
    const statusLoan = loans.filter(b => b.status === req.query.status);
    const repaidLoan = statusLoan.filter(b => b.repaid === JSON.parse(req.query.repaid));
    if (typeof req.query.status != "undefined" && typeof req.query.status !== "undefined") {
        if (statusLoan) {
            if (repaidLoan) {
                res.send(repaidLoan);
            }
        }
        return;
    }
    next();
}