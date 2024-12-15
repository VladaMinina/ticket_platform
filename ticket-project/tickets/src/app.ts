import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler,NotFoundError, currentUserMid } from '@vm-kvitki/common-lib';
import { createTicketRouter } from './routes/new';
import 'express-async-errors';
import { showTicketRouter } from './routes/show';
import { getTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(getTicketsRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

app.all('*', async(req, res) => {
    throw new NotFoundError();
})
console.log("going");
app.use(errorHandler);


export { app };