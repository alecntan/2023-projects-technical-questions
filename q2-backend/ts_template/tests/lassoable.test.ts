import { describe, expect, test } from "@jest/globals";
import request from 'supertest';
import app from '../roundupper_100';

describe('The API returns a 400 when', () => {
  
  test('the input has an incorrect field name', async () => {
    const payload = { 'Dio_stand' : 'The World' };
    const response = await request(app).get('/lassoable').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('the input has an incorrect field value', async () => {
    const payload = { 'cowboy_name' : 3.50 };
    const response = await request(app).get('/lassoable').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('the input is empty', async () => {
    const payload = {};
    const response = await request(app).get('/lassoable').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('the input is of the wrong type', async () => {
    const payload = [ 'Yeah Nah' ];
    const response = await request(app).get('/lassoable').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
})

describe('The API returns a 404', () => {
  test('When a non-existing cowboy name is given', async () => {
    const payload = { 'cowboy_name'  : 'John Cena'};
    const response = await request(app).get('/lassoable').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(404);
  })
})


describe('The API returns a 200 and', () => {
  
  
  test('and a flying_burger when user queries for Makima', async () => {
  
    const init_payload = {
      "entities": [
          {
              "type": "space_cowboy",
              "metadata": {
                  "name": "Aki",
                  "lassoLength": 1 
              },
              "location": {
                  "x": 1,
                  "y": 1
              }
          },
          {
              "type": "space_cowboy",
              "metadata": {
                  "name": "Makima",
                  "lassoLength": 2 
              },
              "location": {
                  "x": 10,
                  "y": 2
              }
          },
          {
              "type": "space_animal",
              "metadata": {
                  "type": "flying_burger"
              },
              "location": {
                  "x": 9,
                  "y": 2
              }
          }
      ]
    }
    let response = await request(app).post('/entity').send(init_payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
    
    const querie_input = { 'cowboy_name'  : 'Makima'};
    response = await request(app).get('/lassoable').send(querie_input).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
    
    const body = response.body;
    expect('space_animals' in body).toBe(true);
    expect(Array.isArray(body.space_animals)).toBe(true)
    expect(body.space_animals.length).toBe(1);
    
    const animal = body.space_animals[0];
    expect(animal.type).toBe('flying_burger');
    expect(animal.location.x).toBe(9);
    expect(animal.location.y).toBe(2);
  })
  
  test('and no animals when user queries for Aki', async () => {
    const querie_input = { 'cowboy_name'  : 'Aki'};
    const response = await request(app).get('/lassoable').send(querie_input).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
    
    const body = response.body;
    expect('space_animals' in body).toBe(true);
    expect(Array.isArray(body.space_animals)).toBe(true)
    expect(body.space_animals.length).toBe(0);
  });
  
});