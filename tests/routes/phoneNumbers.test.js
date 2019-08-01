const request = require('supertest');
const fs = require('fs');
const app = require('../../index');
const tokenService = require('../../services/tokenService');
const fileUtil = require('../../utils/fileUtil');
const config = require('../../configs/config')[process.env.NODE_ENV];
const usersStorePath = config.users;


let token;
let adminToken;
const adminEmail = 'admin@email.com';
describe('Phone numbers routes', () => {
  beforeAll((done) => {
    request(app)
      .post('/api/users')
      .send({
        name: 'name',
        password: 'P@ssw0rd',
        email: 'phone_numbers_test@email.com'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  beforeAll((done) => {
    request(app)
      .post('/api/users')
      .send({
        name: 'admin',
        password: 'P@ssw0rd',
        email: adminEmail
      })
      .end((err, res) => {
        fileUtil.openFile(usersStorePath, (buf, fd) => {
          let users = {};
          if (buf.toString()) {
            users = JSON.parse(buf.toString());
          }
          users[adminEmail].role = 'admin';
          fs.writeSync(fd, JSON.stringify(users));
          fs.closeSync(fd);
        });
        adminToken = res.body.token;
        done();
      });
  });
  describe('Testing generate phone number', () => {
    it('Should return a 401 error if no token was provided', (done) => {
      request(app)
        .post('/api/phoneNumbers')
        .expect(401)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Token not present or invalid');
          done();
        });
    });
    it('Should return a 401 error if no token is invalid', (done) => {
      request(app)
        .post('/api/phoneNumbers')
        .set({
          token: 'token'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Token not present or invalid');
          done();
        });
    });
    it('Should return a 404 if user is not found', (done) => {
      request(app)
        .post('/api/phoneNumbers')
        .set({
          token: tokenService.generateToken({
            id: 'invalid'
          })
        })
        .expect(404)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('User not found');
          done();
        });
    });
    it('Should generate phone number if all checks pass', (done) => {
      request(app)
        .post('/api/phoneNumbers')
        .set({
          token
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body).toHaveProperty('phoneNumber');
          expect(res.body.phoneNumber.length).toEqual(10);
          done();
        });
    });
    it('Should return error 400 if the max number of phone numbers has been exceeded', (done) => {
      request(app)
        .post('/api/phoneNumbers')
        .set({
          token
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Maximum number of phone numbers exceeded');
          done();
        });
    });
  });
  
  describe('Testing getting phone numbers', () => {
    it('Should return the logged in users phone numbers', (done) => {
      request(app)
        .get('/api/phoneNumbers')
        .set({ token })
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(0);
          done();
        });
    });
  });
  
  describe('Testing getting phone numbers details', () => {
    it('Should return error 401 if the logged in user is not an admin', (done) => {
      request(app)
        .get('/api/phoneNumbers/details')
        .set({
          token
        })
        .expect(403)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Permission denied');
          done();
        });
    });
    it('Should return the phone numbers details if the logged in user is an admin', (done) => {
      request(app)
        .get('/api/phoneNumbers/details')
        .set({ token: adminToken })
        .expect(200)
        .end((err, res) => {
          expect(res.body).toHaveProperty('phoneNumbersLength');
          expect(res.body.phoneNumbersLength).toBeGreaterThanOrEqual(0);
          done();
        });
    });
  });
});
