import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { isObservable, Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged, scan, switchAll, switchMap, tap } from 'rxjs/operators';
import { Hooks } from '../hooks';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rxa-renders',
  template: `
    <div class="indicator-ripple" [ngStyle]="{minWidth: radius+'px',minHeight: radius+'px'}" matRipple
         [matRippleColor]="color" [matRippleRadius]="radius">
      {{ numRenders$ | push | json }}
    </div>
  `,
  styles: [`
    :host .indicator-ripple {
      border: 1px solid #ff00005f;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderingsComponent extends Hooks {
  sub: Subscription;

  @ViewChild(MatRipple) ripple: MatRipple;
  changeO$ = new ReplaySubject<Observable<any>>(1);
  numRenders$ = this.afterViewInit$.pipe(
    switchMap(() => this.changeO$.pipe(
      switchAll(),
      distinctUntilChanged(),
      scan(a => ++a, 0),
      tap(() => this.rippleOn && this.ripple.launch({ centered: true }))
    )));

  @Input()
  rippleOn = true;

  @Input()
  radius = 20;

  @Input()
  color = 'rgba(255,0,0,0.24)';

  @Input()
  set value$(v$: Observable<any> | any) {
    if (isObservable(v$)) {
      this.changeO$.next(v$);
    } else {
      if (v$ != null) {
        this.changeO$.next(of(v$));
      }
    }
  };

  constructor() {
    super();
    this.afterViewInit$.subscribe(() => this.ripple.launch({ centered: true }));
  }

}
