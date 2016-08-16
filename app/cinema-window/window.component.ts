/**
 * Created by NamitaMalik on 8/5/16.
 */
import {Component} from '@angular/core';
import {BookingService} from "../common/service/booking-service";

@Component({
    selector: 'cinema-window',
    template: `
    <div>
        <h1>ABC Cinemas</h1>
        <span>Hello Admin</span>
        <p>Currently, Number of Tickets available are: {{ticketCount}}</p>
        <button (click)="bookTicket()">Book Ticket</button>
    </div>
    `
})

export class WindowComponent {
    ticketCount:number = 0;

    constructor(private _bookingService:BookingService) {
        this._bookingService.totalTicketCount.subscribe(totalTicketCount => {
            this.ticketCount = totalTicketCount
        });
    }

    bookTicket = () => {
        this.ticketCount = this.ticketCount - 1;
        this._bookingService.totalTicketCount.next(this.ticketCount);
    };
}