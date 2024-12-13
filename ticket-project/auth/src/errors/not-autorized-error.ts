import {CustomError} from './custom-error';

export class NotAutorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not autorized');
        Object.setPrototypeOf(this, NotAutorizedError.prototype)
    }

    serializeErrors() {
        return [{message: 'Not autorized user'}];
    }

}