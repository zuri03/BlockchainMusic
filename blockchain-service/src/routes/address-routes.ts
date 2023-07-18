import { Router, Request, Response, NextFunction } from 'express';
import { checkAndValidateAuthorizationHeader, authorizeReqest } from '../middleware/middleware-functions';
import { dynamo } from '../db/dynamo-db';
import SmartContractDeployer from '../deployer/deployer';

const router: Router = Router();

//POST
//Create a new entry in db and deploy a new smart contract for the user
router.post('/', checkAndValidateAuthorizationHeader, authorizeReqest, async (request: Request, response: Response, next: NextFunction) => {

    const { userid } = request.body;

    if (!userid) {
        response.status(400).json({ 'error': 'required values missing from body' });
        return;
    }

    try {  
        //check if entry with key: userid already exists
        const result = await dynamo.getDBEntry(userid!);

        //if it does exist return 409 error: resource already exists and return the resource
        if (result) {
            response.status(409).json({ 'data': result });
            return;
        }

        //deploy a new smart contract
        //const smartContractDeployer: SmartContractDeployer = SmartContractDeployer.getDeployerInstance();
        //const smartContractAddress: string = smartContractDeployer.deploySmartContract();

        //create a new entry key: userid, value: contract address
        await dynamo.createDBEntry(userid, 'placeholder address');

        //return success response including the new entry
        response.status(200).json({ 'data': { userid, 'address': 'placeholder address' } })
    } catch (error) {
        next(error);
    }
});

//GET 
router.get('/:userid', async (request: Request, response: Response, next: NextFunction) => {
    const userid: string | undefined = request.params.userid;

    if (!userid) {
        response.status(400).json({ 'error': 'userid missing from requests' });
        return;
    }

    try {
        const result = await dynamo.getDBEntry(userid!);

        if (!result) {
            response.status(404).json({ 'error': `resource ${userid} not found` });
            return;
        }

        response.status(200).json({ 'data': result });
    } catch (error) {
        next(error);
    }
});  

//DELETE 
router.delete('/:userid', checkAndValidateAuthorizationHeader, authorizeReqest, async (request: Request, response: Response, next: NextFunction) => {
    const userid: string | undefined = request.params.userid;

    if (!userid) {
        response.status(400).json({ 'error': 'userid missing from requests' });
        return;
    }

    try {
        await dynamo.deleteDBEntry(userid!);
        response.status(200).json({ 'data': 'success' });
    } catch (error) {
        next(error);
    }
});  

export default router;