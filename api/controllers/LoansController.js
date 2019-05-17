import short_id from "short-uuid";
import time_ago from "timeago.js";
import {
    loans,
    repayments
} from "../models/dummy_loans.js";

export function postLoan(req, res) {
    const loan = {
        id: short_id.generate(),
        user: req.body.user,
        timeCreated: Date.now,
        status: "pending",
        repaid: false,
        tenor: req.body.tenor,
        amount: req.body.amount,
        paymentInstallment: (req.body.amount + req.body.interest) / req.body.tenor,
        balance: 300,
        interest: (15 / 100) * req.body.amount,
    };
    loans.push(loan);
    res.status(201).send(loan);
}

export function viewLoanRepayments(req, res) {
    const loanHistory = repayments.filter(a => a.id === req.params.loanId);
    if (!loanHistory || loanHistory.length < 1) {
        res.status(404).send({
            message: "Loan repayment history not found"
        });
        return;
    }
    loanHistory.forEach((loan) => {
        loan.timeCreated = time_ago.format(loan.timeCreated);
    });
    res.send(loanHistory);
}

export function viewSpecificLoan(req, res) {
    const loan = loans.find(a => a.id === req.params.loanId);
    loan.timeCreated = time_ago.format(loan.timeCreated);
    res.status(200).send(loan);
}

export function viewHistory(req, res) {
    res.status(200).send(loan)
}

export function approveLoan(req, res) {
    const loan = loans.find(a => a.id === req.params.loanId);
    loan.status = "approved";
    res.status(200).send(loan);
}

export function rejectLoan(req, res) {
    const loan = loans.find(a => a.id === req.params.loanId);
    loan.status = "rejected";
    res.status(200).send(loan);
};