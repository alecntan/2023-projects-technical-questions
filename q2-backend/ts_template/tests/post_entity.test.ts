import { describe, expect, test, beforeEach } from "@jest/globals";
import request from 'supertest';
import app from '../roundupper_100';

describe('A valid post request to /entity', () => {

  test('will return a 200 response', async () => {
  
    const payload = {
      "entities": [
          {
              "type": "space_cowboy",
              "metadata": {
                  "name": "Jim",
                  "lassoLength": 1 
              },
              "location": {
                  "x": 3,
                  "y": 2
              }
          },
          {
              "type": "space_cowboy",
              "metadata": {
                  "name": "Bob",
                  "lassoLength": 2 
              },
              "location": {
                  "x": 7,
                  "y": 3
              }
          },
          {
              "type": "space_animal",
              "metadata": {
                  "type": "flying_burger"
              },
              "location": {
                  "x": 7,
                  "y": 3
              }
          },
          {
            "type": "space_animal",
            "metadata": {
                "type": "pig"
            },
            "location": {
                "x": 7,
                "y": 3
            }
        },
        {
          "type": "space_animal",
          "metadata": {
              "type": "cow"
          },
          "location": {
              "x": 7,
              "y": 3
          }
      }
      ]
    }
    
    
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
  })
})

describe("A payload without an 'entities' property", () => {
  const payload = {};
  
  test('will return a 400 response', async () => {
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
})

describe("The API returns a 400 response when the entities property", () => {
  
  test("is an object" , async () => {
    const payload = { "entities" : { 'is' : 'invalid '}};
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test("is a string literal" , async () => {
    const payload = 'invalid';
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  
  test('contains invalid types', async () => {
    const payload = {
      "entities" : [
        {
          "type": "earth_cowboy",
          "metadata": {
              "name": "Jim",
              "lassoLength": 1 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('does not contain space_cowboy metadata', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": 1 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('contains no space_cowboy name metadata', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "n": "Jim",
              "lassoLength": 1 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('contains invalid space_cowboy name metadata', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": 12,
              "lassoLength": 1 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('contains no space_cowboy lassoLength metadata', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLen": 1 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('contains invalid space_cowboy lassoLength metadata', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "location": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Does not contain space_cowboy location property', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "loc": {
              "x": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Does not contain space_cowboy location x-property', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "location": {
              "z": 3,
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Does not contain space_cowboy location y-property', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "location": {
              "x": 3,
              "z": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Does not contain space_cowboy valid location y-property', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "location": {
              "x": 3,
              "y": "2"
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Does not contain space_cowboy valid location x-property', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_cowboy",
          "meta_data": {
              "name": "Jim",
              "lassoLength": "1" 
          },
          "location": {
              "x": "3",
              "y": 2
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
  test('Contains invalid space_animal type', async () => {
    const payload = {
      "entities" : [
        {
          "type": "space_animal",
          "metadata": {
              "type": "Pickle"
          },
          "location": {
              "x": 7,
              "y": 3
          }
      }
      ]
    }
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  })
  
})

describe("An empty 'entities' object", () => {
  const payload = { "entities": [] };
  
  test('Will return a 200 response', async () => {
    const response = await request(app).post('/entity').send(payload).set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(200);
  })
})
