# Realtime Update in Angular2

Many times we encounter a situation when we need to update our view **real time**. By **real time** I mean that as soon as a component changes the value of a particular variable,
it should get updated at all other components which are using that variable.

Let's get deeper into it by the simple example. In of my earlier [blogs](https://namitamalik.github.io/Services-in-Angular2/) on **services in Angular2**, we had taken an example of a cinema ticket booking scenario where we had:

1. `AppComponent` - Parent component of the entire application. Included 2 child components.
2. `BookShowComponent` - Component used to make booking through bookshow.com.
3. `WindowComponent` - Component accessed to make booking through cinema window.
4. `BookingService` - A service accessed by both `WindowComponent` and `BookShowComponent` to get the number of tickets available.

Above components were then joined together to make a simple `app` where a user was able to book movie ticket and after each booking, the available ticket count would get updated.
But, this small `app` had a serious `flaw` - even though, after each booking, number of tickets then available were getting updated, but one component would not know that the other component has updated the ticket till a booking request was made.

See below:

![services_blog.gif](https://raw.githubusercontent.com/NamitaMalik/Realtime-Update-in-Angular2/blob/master/assets/Services_Blog.gif)


