import express from 'express';
import request from 'supertest';
import loansRoute from '../api/routes/loans';
import usersRoute from '../api/routes/users';

const app = express();
app.use(express.json());

app.use('/api/v1/loans', loansRoute);
app.use('/api/v1/users', usersRoute);


describe('accessible to only users with a token', () => {
    let token = '';
    before((done) => {
        request(app)
            .post('/api/v1/users/auth/signin')
            .send({
                email: 'tonystark@marvel.com',
                password: 'randompassword',
            })
            .end((err, res) => {
                const result = JSON.parse(res.text);
                token = result.token;
                done();
            });
    });

    it('checks if loan posts', (done) => {
        request(app)
            .post('/api/v1/loans')
            .send({
                user: 'peterparker@marvel.com'
            })
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(201);
                res.body.should.have.property('status', 'pending');
                done();
            });
    });
    it('check if user has a pending loan request', (done) => {
        request(app)
            .post('/api/v1/loans')
            .send({
                user: 'tonystark@marvel.com'
            })
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(409);
                res.body.message.should.equal("You can not request for a loan at this time because you have requested for a loan previously");
                done();
            });
    });
    it('if there is no loan repayment history' , (done) => {
        request(app)
            .get('/api/v1/loans/QC-20180714/repayments')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.status.should.equal(404);
                res.body.message.should.equal('Loan repayment history not found');
                done();
            });
    });
    it('checks if repayment history is sent ', (done) => {
        request(app)
            .get('/api/v1/loans/QC-20180407/repayments')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body[0].should.have.property('amount').which.is.a.Number();
                res.body[0].should.have.property('monthlyInstallment').which.is.a.Number();
                done();
            });
    });
});

describe('Only accessible by an admin', () => {
    let token = '';

    before((done) => {
        request(app)
            .post('/api/v1/users/auth/signin')
            .send({
                email: 'tonystark@marvel.com',
                password: 'randompassword1',
            })
            .end((err, res) => {
                const result = JSON.parse(res.text);
                token = result.token;
                done();
            });
    });
    it('checks if there are any loan applications', (done) => {
        request(app)
            .get('/api/v1/loans')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    it('gets specific loan by id', (done) => {
        request(app)
            .get('/api/v1/loans/QC-20180414')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('amount').which.is.a.Number();
                done();
            });
    });
    it("checks loans that have not been repaid", (done) => {
        request(app)
            .get('/api/v1/loans?status=approved&repaid=false')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body[0].should.have.property('status', 'approved');
                res.body[0].should.have.property('repaid', false);
                done();
            });
    });
    it("checks loans that have been repaid", (done) => {
        request(app)
            .get('/api/v1/loans?status=approved&repaid=true')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body[0].should.have.property('status', 'approved');
                res.body[0].should.have.property('repaid', true);
                done();
            });
    });
    it('checks if query is defined', (done) => {
        request(app)
            .get('/api/v1/loans?status=approved&repaid=true')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                done();
            });
    });
    it('Approves user (Admin)', (done) => {
        request(app)
            .patch('/api/v1/loans/QC-20180614/approve')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('status', 'approved');
                done();
            });
    });
    it('Rejects user (Admin)', (done) => {
        request(app)
            .patch('/api/v1/loans/QC-20180417/reject')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('status', 'rejected');
                done();
            });
    });
});

describe('miscellaneous Tests', () => {
    it('test 404 erorr', (done) => {
        request(app)
            .get('/api/v1/loa')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.status.should.equal(404);
                done();
            });
    });
});