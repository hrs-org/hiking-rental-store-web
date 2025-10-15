import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private ngZone = inject(NgZone);
  private counter = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable().pipe(debounceTime(0));

  show() {
    this.counter++;
    this.ngZone.run(() => this.loadingSubject.next(true));
  }

  hide() {
    this.counter = Math.max(0, this.counter - 1);
    if (this.counter === 0) {
      this.ngZone.run(() => this.loadingSubject.next(false));
    }
  }
}
