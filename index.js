import express from "express";
import usersRoutes from "./api/routes/users";
import loanRoutes from "./api/routes/loans";

const app = express();
app.use(express.json());

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/loans", loanRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: error.status || 500,
        message: error.message
    });
    next()
});


app.listen(process.env.PORT || 5000, () => console.log('listening on port 5000'));