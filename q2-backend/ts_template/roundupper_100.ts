import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

const BAD_REQUEST_HTTP_STATUS = 400;
const OK_HTTP_STATUS = 200;

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json());

// === Type Predicates === 
function isSpaceCowboy( obj : any ) : obj is spaceCowboy {
  return 'name' in obj && 'lassoLength' in obj;
}

function isSpaceAnimal( obj : any ) : obj is spaceAnimal {

  return 'type' in obj && 
    ( obj.type === 'pig' || 
      obj.type === 'cow' || 
      obj.type === 'flying_burger'
    );
}

function isLocation( obj : any ) : obj is location {
  return 'x' in obj && 'y' in obj;
}

function isSpaceEntity( obj : any ) : obj is spaceEntity {
  return ('type' in obj && ( obj.type === 'space_cowboy' || obj.type === 'space_animal')) &&
         ( 'metadata' in obj && (isSpaceCowboy(obj.metadata) || isSpaceAnimal(obj.metadata))) &&
         ( 'location' in obj && ( isLocation(obj.location)));
         
}


// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {

  const body = req.body;   
  
  if( !( 'entities' in body ) ) {
    return res.status(BAD_REQUEST_HTTP_STATUS).end();
  }
  
  const buffer  = [] as spaceEntity[];
  try {
    for( let obj of body.entities ) {
      if( isSpaceEntity(obj) ) {
        buffer.push(obj);
      } else {
        throw new Error();
      }
    }
  } catch {
    return res.status(BAD_REQUEST_HTTP_STATUS).end();
  }
  
  buffer.forEach((spaceEntity) => {
    spaceDatabase.push(spaceEntity);
  })
  
  return res.status(OK_HTTP_STATUS).end();
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    // TODO: fill me in
})

// Removed so that express stops after tests in Jest
//app.listen(8080);

export default app;

