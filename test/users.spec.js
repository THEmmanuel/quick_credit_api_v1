import express from 'express';
import request from 'supertest';
import usersRoute from '../api/routes/users';
import { users, testData, token } from '../api/models/dummy_users';

const app = express();
app.use(express.json());

app.use('/api/v1/users', usersRoute);

describe('Tests Signup route', () => {
  it('check required feilds', (done) => {
    request(app)
      .post('/api/v1/users/auth/signup')
      .send(testData[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.message.should.equal('email is required');
        done();
      });
  });
  it('checks input length', (done) => {
    request(app)
      .post('/api/v1/users/auth/signup')
      .send(testData[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.message.should.be.eql('email must be a minimum of three characters long');
        done();
      });
  });

  it('checks for username existance', (done) => {
    request(app)
      .post('/api/v1/users/auth/signup')
      .send(testData[3])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(409);
        res.body.message.should.equal(`${testData[3].email} has already been used`);
        done();
      });
  });

  it('checks if user has been posted', (done) => {
    request(app)
      .post('/api/v1/users/auth/signup')
      .send(testData[4])
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(201);
        done();
      });
  });
});

describe('Users Signin', () => {
  it('check if user data exists', (done) => {
    request(app)
      .post('/api/v1/users/auth/signin')
      .send({
        email: 'johndoe@gmail.com',
        password: 'randompassword',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('email');
        res.body.should.have.property('token');
        done();
      });
  });

  it('checks if username and password match', (done) => {
    request(app)
      .post('/api/v1/users/auth/signin')
      .send({
        email: 'johnnydoe@gmail.com',
        password: 'randompasword',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(401);
        res.body.message.should.equal('Incorrect password or username, check details and try again');
        done();
      });
  });
});

describe('verify User', () => {
  let token = '';

  before((done) => {
    request(app)
      .post('/api/v1/users/auth/signin')
      .send({
        email: 'maryjane@gmail.com',
        password: 'randompassword1',
      })
      .end((err, res) => {
        const result = JSON.parse(res.text);
        token = result.token;
        done();
      });
  });
  it('checks user verification', (done) => {
    request(app)
      .patch('/api/v1/users/peterparker@marvel.com/verify')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('status', 'verified');
        done();
      });
  });
  it('checks if user to be verified is not found', (done) => {
    request(app)
      .patch('/api/v1/users/johnnydoe@gmail.com/verify')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.message.should.equal('user not found');
        done();
      });
  });
});

describe('verify User non admin', () => {
  let token = '';

  before((done) => {
    request(app)
      .post('/api/v1/users/auth/signin')
      .send({
        email: 'andy@gmail.com',
        password: 'january',
      })
      .end((err, res) => {
        const result = JSON.parse(res.text);
        token = result.token;
        done();
      });
  });
  it('checks user verification if user not admin', (done) => {
    request(app)
      .patch('/api/v1/users/maryjane@gmail.com/verify')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.status.should.equal(403);
        res.body.message.should.equal('Forbidden');
        done();
      });
  });
});