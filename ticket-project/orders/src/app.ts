import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler,NotFoundError, currentUserMid } from '@vm-kvitki/common-lib';
import 'express-async-errors';
import { deleteOrderRouter } from '../routes/delete';
import { showOrderRouter } from '../routes/show';
import { indexOrderRouter } from '../routes';
import { newOrderRouter } from '../routes/new';

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
app.use(currentUserMid);

app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);

app.all('*', async(req, res) => {
    throw new NotFoundError();
})
console.log("going");
app.use(errorHandler);


export { app };