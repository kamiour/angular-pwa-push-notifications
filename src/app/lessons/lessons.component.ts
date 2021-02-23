import { Component, OnInit } from "@angular/core";
import { LessonsService } from "../services/lessons.service";
import { Observable, of } from "rxjs";
import { Lesson } from "../model/lesson";
import { SwPush } from "@angular/service-worker";
import { NewsletterService } from "../services/newsletter.service";
import { catchError } from "rxjs/operators";

@Component({
  selector: "lessons",
  templateUrl: "./lessons.component.html",
  styleUrls: ["./lessons.component.css"],
})
export class LessonsComponent implements OnInit {
  lessons$: Observable<Lesson[]>;
  isLoggedIn$: Observable<boolean>;
  sub: PushSubscription;

  readonly VAPID_PUBLIC_KEY =
    "BOLb9l8LEylHnPP5tBTa8o7qWC1BCOaNQLlrTIMTPnL0Z2_daDun7J0PmYrJlGb2I2kScfoHPt7to0yimr1PUWc";

  constructor(
    private lessonsService: LessonsService,
    private swPush: SwPush,
    private newsletterService: NewsletterService
  ) {}

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.lessons$ = this.lessonsService
      .loadAllLessons()
      .pipe(catchError((err) => of([])));
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub: PushSubscription) => {
        console.log(sub);

        this.sub = sub;
        this.newsletterService.addPushSubscriber(sub).subscribe(
          () => console.log("Subscription sent to server successfully"),
          (err) =>
            console.log("Error occurred sending subscription to server: ", err)
        );
      })
      .catch((err) => console.log(err));
  }

  sendNewsletter() {
    console.log("Sending a newsletter to all users");

    this.newsletterService.send().subscribe();
  }
}
