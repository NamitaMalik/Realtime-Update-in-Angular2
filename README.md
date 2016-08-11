# Realtime Update in Angular2

Many a times we encounter a situation when we need to update our view **real time**. By **real time** I mean that as soon as a component changes the value of a particular variable,
all other components should get the updated value.

Let's get deeper into it by the simple example. In of my earlier [blogs](https://namitamalik.github.io/) on [**Services in Angular2**](https://namitamalik.github.io/Services-in-Angular2/), we had taken an example of a cinema ticket booking scenario where we had:

1. `AppComponent` - Parent component of the entire application. Included 2 child components.
2. `BookShowComponent` - Component used to make booking through web application e.g. bookshow.com.
3. `WindowComponent` - Component accessed to make booking through cinema window.
4. `BookingService` - A service accessed by both `WindowComponent` and `BookShowComponent` to get the number of tickets available.

Above components were then joined together to make a simple `app`. Using this app a user was able to book movie ticket and after each booking, the available ticket count would get updated.
But, this small `app` had a serious flaw - one component would not know that the other component has updated the ticket till a booking request was made.

See below:

![Services_Blog.gif](https://raw.githubusercontent.com/NamitaMalik/Realtime-Update-in-Angular2/master/assets/Services_Blog.gif)

Did you notice the following:

1. Initially, total number of available tickets were 10.
2. On booking a ticket through cinema window, the number of available tickets became 9, while at bookshow.com, number of available tickets was still 10.
3. Similarly, after making a booking through bookshow.com, number of available tickets became 8 as correctly displayed on bookshow.com but cinema window still has the booking count as 9.

To avoid such a situation, we need to do something so that both the components show data consistently. But how?

Well, it would not be wrong if I say, that **Angular2** has bought best of all the worlds together and the simple solution the above problem is **Observables**. We know that **Observables** are being
heavily used in **Angular2** just as **Promises** in **Angular 1.x**. But unlike **Promises**, **Observables** have much bigger role to play. Being based on the **Observer Pattern** they involve much more than extracting **success** and **error**.
So, let's see some other useful stuff that **Observables** can do for us.


If look at the services [blog](https://namitamalik.github.io/Services-in-Angular2/) you will notice that our `booking-service.ts` looks like:
 
```
import {Injectable} from "@angular/core";
@Injectable()
export class BookingService {
    totalTicketCount:number = 10;
}
```

... and this is the place where we need to make the most important change i.e. making the `totalTicketCount` a **subject**.

Well, the above line put up a plethora of questions in front of us so let's try to answer each question one by one:

**Q. What is Subject?**

Ans. **Subject** is a class in **RxJS** library. It inherits both **Observable** and **Observer** therefore we can easily say that a **subject** is both **observer** and **observable**.
We know that **observers** subscribe to an **observable** and if **subject** is both **observer** and **observable** this means that there would be **observers** subscribing to it and also it subscribing to some other source.
A **subject**  simply broadcasts values pushed to it, to all the **subscribers** subscribing to it.

**Q. Are there any different implementations of Subject?**

Ans. There are basically 3 different implementation of **Subject** which provide different functionality and can be used on the basis of your use case:

    a. **ReplaySubject** - Stores all the values that have been pushed. It emits all the items that were emitted by the source, to all the **observers** that **subscribe** to it.
    b. **AsyncSubject** - It stores the last value and emits it when the sequence is completed.
    c. **BehaviorSubject** - **BehaviorSubject** is similar to **ReplaySubject** but it stores only the last value published. Also another difference that distinguishes it from **AsyncSubject** and **ReplaySubject** is that it takes default value at the time of initialisation.
So an **observer** subscribing to **BehaviorSubject** would receive a value as soon as it subscribes to it.
   
**Q. Which one out of the 3 implementations, we are going to use for our use case?**

Ans. We are going to use **BehaviorSubject** for our case.

**Q. Can we see some action now?**
Ans. Yes Sure, here we go.....

So, let's make `totalTicketCount` a **BehaviorSubject** as given below:

```
totalTicketCount:BehaviorSubject<number> = new BehaviorSubject<number>(10);
```

After making this tweak and importing `BehaviorSubject`, our `booking-service.ts` now looks as:

```
   import { Injectable } from '@angular/core';
   import {BehaviorSubject} from 'rxjs/Rx';
   
   @Injectable()
   export class BookingService {
       totalTicketCount:BehaviorSubject<number> = new BehaviorSubject<number>(10);
   
   }
```

Now, let's make some tweaks in our `book-show.component.ts` and `window.component.ts` and these should be:

1. We first need to subscribe to our `totalTicketCount` subject so that we can start receiving values from it:

```
    constructor(private _bookingService:BookingService) {
        this._bookingService.totalTicketCount.subscribe(totalTicketCount => {
            this.ticketCount = totalTicketCount
        });
    }
```
   
2. Once a user makes a booking we need to update the `totalTicketCount`:
 
 ```
     bookShow = () => {
         let ticketCount = this.ticketCount - 1;
         this._bookingService.totalTicketCount.next(ticketCount);
     }
```
We have updated the `totalTicketCount` by notifying the `observer` about the next value.

After doing the above tweaks in both `book-show.component.ts` and `window.component.ts`, they would look like:

**book-show.component.ts**

```
import { Component } from '@angular/core';
import {BookingService} from "../common/service/booking-service";

@Component({
    selector: 'book-show',
    template: `
    <div>
        <h1>Welcome to bookshow.com</h1>
        <span>Welcome User</span>
        <p>Currently, Number of Tickets available are: {{ticketCount}}</p>
        <button (click)="bookShow()">Book Ticket</button>
    </div>
    `
})

export class BookShowComponent {
    ticketCount:number = 0;
    constructor(private _bookingService:BookingService) {
        this._bookingService.totalTicketCount.subscribe(totalTicketCount => {
            this.ticketCount = totalTicketCount
        });
    }

    bookShow = () => {
        let ticketCount = this.ticketCount - 1;
        this._bookingService.totalTicketCount.next(ticketCount);
    }
        ;
}

```

**window.component.ts**

```
import { Component } from '@angular/core';
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
```

After doing the above tweaks, we should now be able to see the available ticket count **real-time** as shown in below:

![Realtime-Blog.gif](https://raw.githubusercontent.com/NamitaMalik/Realtime-Update-in-Angular2/master/assets/Realtime_Blog.gif)

>Note: This is a small demo app to show how to make real time client updates. In a real world app, one will have to get the updated data from the server by using things like socket connections(which is not the agenda of this blog).

Follow Me
---
[Github](https://github.com/NamitaMalik)

[Twitter](https://twitter.com/namita13_04)

[LinkedIn](https://in.linkedin.com/in/namita-malik-a7885b23)

[More Blogs By Me](https://namitamalik.github.io/)