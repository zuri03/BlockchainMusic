import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

//POST
//Create a new entry in db and deploy a new smart contract for the user
router.post('/', (request: Request, response: Response, next: NextFunction) => {

});

//GET 
//Get the smart conract address belonging to a user
router.get('/:userid', (request: Request, response: Response, next: NextFunction) => {
    
});

export default router;