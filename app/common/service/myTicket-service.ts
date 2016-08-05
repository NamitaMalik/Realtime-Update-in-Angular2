/**
 * Created by namita on 8/5/16.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class MyTicketService {
    constructor(private _http:Http) {
    }
}