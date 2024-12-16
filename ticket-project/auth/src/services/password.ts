import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsynch = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsynch(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPasswors: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPasswors.split('.');
        const buf = (await scryptAsynch(suppliedPassword, salt, 64)) as Buffer;
        console.log('comparing');
        console.log(buf.toString('hex'));
        console.log(hashedPassword);
        console.log(buf.toString('hex') === hashedPassword);
        return buf.toString('hex') === hashedPassword;
    }
}