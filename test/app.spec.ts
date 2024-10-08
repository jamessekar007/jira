import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index'; // Import the app

describe('GET /userType', () => {
  it('should return a message saying "Hello, World!"', async () => {
    const response = await request(app).get('/userType');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Hello, World!');
  });
});