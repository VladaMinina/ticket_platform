import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handlihg';
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors';

const app = express();
app.set('trust proxy', true); //use it cause you are using express ingress-injnex
                            //  traffic is secure even if it is comming through the proxy
app.use(json());
app.use(
    cookieSession({
        signed: false, //no encrypt
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
console.log("going");
app.all('*', async(req, res) => {
    throw new NotFoundError();
})
console.log("going");
app.use(errorHandler);


export { app };