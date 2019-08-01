const request = require('supertest');
const app = require('../../index');

describe('Users routes', () => {
  describe('Testing user registration', () => {
    it('Should return 400 if name is not provided', (done) => {
      request(app)
        .post('/api/users')
        .send({})
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('The name field is required');
          done();
        });
    });
    it('Should return 400 if name length is greater than 50', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name this is a very long name '
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('This name is too long');
          done();
        });
    });
    it('Should return 400 if password is not provided', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('The password field is required');
          done();
        });
    });
    it('Should return 400 if password is too weak', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'weak'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Your password must be greater than 8 characters and must contain at least one uppercase letter, one lowercase letter, one number, and a special character');
          done();
        });
    });
    it('Should return 400 if email is not provided', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'P@ssw0rd'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('The email field is required');
          done();
        });
    });
    it('Should return 400 if email is not valid', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'P@ssw0rd',
          email: 'invalid_email'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Invalid email');
          done();
        });
    });
    it('Should return 400 if email is too long', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'P@ssw0rd',
          email: 'this is a very long email this is a very long email this is a very long email this is a very long email this is a very long email this is a very long email this is a very long email this is a very long email this is a very long email '
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Invalid email');
          done();
        });
    });
    it('Should register a user if all the required fields are filled accurately', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'P@ssw0rd',
          email: 'email@email.com'
        })
        .expect(201)
        .end((err, res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('name');
          expect(res.body.user.name).toEqual('name');
          done();
        });
    });
    it('Should return 400 if email is already exists', (done) => {
      request(app)
        .post('/api/users')
        .send({
          name: 'name',
          password: 'P@ssw0rd',
          email: 'email@email.com'
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('This email already exists');
          done();
        });
    });
  });
  describe('Testing user login', () => {
    it('Should return 400 if email is not provided', (done) => {
      request(app)
        .post('/api/users/login')
        .send({})
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('The email field is required');
          done();
        });
    });
    it('Should return 400 if password is not provided', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'email@gmail.com',
        })
        .expect(400)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('The password field is required');
          done();
        });
    });
    it('Should return 401 if user with email do not exist', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'idDoNotExist@gmail.com',
          password: 'invalid_password'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Email or Password is invalid');
          done();
        });
    });
    it('Should return 401 if password is invalid', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'email@email.com',
          password: 'invalid_password'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body.error).toHaveProperty('message');
          expect(res.body.error.message).toEqual('Email or Password is invalid');
          done();
        });
    });
    it('Should log in user if credentials are valid', (done) => {
      request(app)
        .post('/api/users/login')
        .send({
          email: 'email@email.com',
          password: 'P@ssw0rd'
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body).toHaveProperty('token');
          done();
        });
    });
  });
});
