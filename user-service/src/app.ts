import express, { 
    Router, 
    Request, 
    Response, 
    NextFunction, 
    Application 
} from 'express';
import bodyParser from 'body-parser';
import { CustomErrorHandler, validateAPIKey } from './middleware/middleware-functions';
import UserController from './controllers/user-controller';
import AuthController from './controllers/auth-controller';
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

const initAuthRouter = function (controller: AuthController): Router {
    const router: Router = Router();

    router.use((request: Request, response: Response, next: NextFunction) => {
        const method: string = request.method;
        
        if (method !== 'POST') {
            response.status(405).json({ 'error': 'method not supported' });
            return;
        }
        
        next();
    });

    router.post('/', controller.authenticate.bind(controller));

    return router;
}

export default async function configureApp(database: UserDB) : Promise<Application> {
    const app : Application = express();
    const userController = new UserController(database);
    const authController = new AuthController(database);
    const userRouter = initUserRouter(userController);
    const authRouter = initAuthRouter(authController);

    app.use(validateAPIKey);

    //Simple and temporary request logger
    app.use((request, response, next) => {
        console.log(`INFO: ${request.method}: URL: ${request.url}`);
        next();
    });

    app.use(bodyParser.json());

    app.use('/auth', authRouter);

    app.use('/api/User', userRouter);

    app.use((request, response, next) => {
        response.status(404).json({ 'error': 'unsupported route'});
        return;
    });

    app.use(CustomErrorHandler);

    return app;
}
 