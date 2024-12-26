import {Subjects, Publisher, ExpirationCompleteEvent} from '@vm-kvitki/common-lib';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}