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

const BAD_REQUEST = 400;
const OK = 200;
const NOT_FOUND = 404;

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json());

// === Type Predicates === 
function isSpaceCowboy( obj : any ) : obj is spaceCowboy {
  return ( 'name' in obj && typeof obj.name === 'string') && 
         ( 'lassoLength' in obj && typeof obj.lassoLength === 'number' );
}

function isSpaceAnimal( obj : any ) : obj is spaceAnimal {

  return 'type' in obj && 
    ( obj.type === 'pig' || 
      obj.type === 'cow' || 
      obj.type === 'flying_burger'
    );
}

function isLocation( obj : any ) : obj is location {
  return ( 'x' in obj && typeof obj.x  === 'number' ) && 
         ( 'y' in obj && typeof obj.y === 'number' );
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
    return res.status(BAD_REQUEST).end();
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
    return res.status(BAD_REQUEST).end();
  }
  
  buffer.forEach((spaceEntity) => {
    spaceDatabase.push(spaceEntity);
  })
  
  return res.status(OK).end();
});


type CowboyName = { 
  "cowboy_name" : string
}

type AnimalTypeAndLocation = {
  type : "pig" | "cow" | "flying_burger",
  location : location
};

type CowboyLocationAndLassoLength = {
  lassoLength : number,
  location : location
}

function isCowboyName(obj : any ) : obj is CowboyName {
  return "cowboy_name" in obj && typeof obj.cowboy_name === 'string';
}

function getDistance( loc1 : location, loc2 : location ) : number {
  
  const x_diff = (loc2.x - loc1.x );
  const y_diff = (loc2.y - loc1.y );
  
  return Math.sqrt( Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
}

function getCowboyDetails( name : string ) : CowboyLocationAndLassoLength | null {

  for(let spaceEntity of spaceDatabase ) {
    
    if( spaceEntity.type === 'space_cowboy' && spaceEntity.metadata.name === name ) {
      return {
        lassoLength: spaceEntity.metadata.lassoLength,
        location: spaceEntity.location
      }
    }
  }
  return null;
}

function getLassoableAnimals( cowboy : CowboyLocationAndLassoLength ) : AnimalTypeAndLocation[] {
  const lassoableAnimals = [] as AnimalTypeAndLocation[];
    
  for(let entity of spaceDatabase ){
    if(entity.type === 'space_animal') {
      const distance = getDistance(cowboy.location, entity.location );
      if( distance <= cowboy.lassoLength ) {
        lassoableAnimals.push({
          type: entity.metadata.type,
          location: entity.location
        }
        );
      }
    }
  }
  
  return lassoableAnimals;
}

// lassoable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const body = req.body;
    if( !isCowboyName(body)) {
      return res.status(BAD_REQUEST).end();
    }
    
    const queriedCowBoy = getCowboyDetails(body.cowboy_name);
    
    if( queriedCowBoy === null ) {
      return res.status(NOT_FOUND).end();
    }
    
    const lassoableAnimals = getLassoableAnimals(queriedCowBoy);
    
    const payload = {
      "space_animals" : lassoableAnimals
    };
    
    return res.send(payload).end();
})

// Removed so that express stops after tests in Jest
//app.listen(8080);

export default app;

