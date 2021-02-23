import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class NewsletterService {
  constructor(private http: HttpClient) {}

  addPushSubscriber(sub: PushSubscription): Observable<any> {
    return this.http.post("/api/notifications", sub);
  }

  send(): Observable<any> {
    return this.http.post("/api/newsletter", null);
  }
}
