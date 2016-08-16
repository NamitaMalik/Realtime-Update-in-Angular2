/**
 * Created by NamitaMalik on 8/5/16.
 */
import {Component} from '@angular/core';
import {BookingService} from "./common/service/booking-service";
import {WindowComponent} from "./cinema-window/window.component";
import {BookShowComponent} from "./book-show/book-show.component";
import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
        <cinema-window></cinema-window>
        <book-show></book-show>
    `,
    directives: [WindowComponent, BookShowComponent],
    providers: [BookingService]
})

export class AppComponent {
}