import express from 'express';

const router: express.Router = express.Router();

//POST
router.post('/', async (request: express.Request, response: express.Response, next: express.NextFunction) => {
  try{
    const { username, password } = request.body;

    if (!username || !password) {
      const responseBody = { 
        'error': `one or more required values missing from request body` 
      }
      response.status(400).json(responseBody);
      return;
    }

    //hash the password

    //create a new user object

    //store new user in db

    console.log({ username, password })

    
  } catch (error) {
    next(error);
  }
  
  response.status(200).end();
});

export default router;