/**
 * Created by Namita Malik on 8/5/16.
 */
import { Injectable } from '@angular/core';

import {BehaviorSubject} from 'rxjs/Rx';


@Injectable()
export class BookingService {
    totalTicketCount:BehaviorSubject<number> = new BehaviorSubject<number>(10);

}