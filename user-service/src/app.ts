import express, { 
    Router, 
    Request, 
    Response, 
    NextFunction, 
    Application 
} from 'express';
import bodyParser from 'body-parser';
import authenticationRouter from './routes/authenticate-routes';
import { CustomErrorHandler, validateAPIKey } from './middleware/middleware-functions';
import UserController from './controllers/user-controller';
import { UserDB } from './types/app-types';

const initUserRouter = function (controller: UserController): Router {
    const router: Router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
        
        if (![ 'GET', 'POST' ].includes(method)) {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
        
        next();
    });

    router.get('/:id', controller.getUser.bind(controller));
    router.post('/', controller.createUser.bind(controller));

    return router;
}

export default async function configureApp(database: UserDB) : Promise<Application> {

    const app : Application = express();
    const controller = new UserController(database);
    const router = initUserRouter(controller);

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use('/auth', authenticationRouter);

    app.use('/api/User', router);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    app.use(CustomErrorHandler);

    return app;
}
 