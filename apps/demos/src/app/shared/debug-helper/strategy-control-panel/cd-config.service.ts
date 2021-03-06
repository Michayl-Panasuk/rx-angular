import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { RxState } from '@rx-angular/state';

export interface CdConfig {
  strategy: string;
}

@Injectable({ providedIn: 'root' })
export class CdConfigService extends RxState<CdConfig> {
  public readonly strategyName$ = this.select('strategy');

  constructor(  protected appRef: ApplicationRef,
                protected ngZone: NgZone) {
    super();
    this.set({
      strategy: 'local',
    });
  }

  getConfig(prop?: keyof CdConfig): CdConfig | string {
    return prop ? this.get(prop) : '';
  }

  appRef_tick() {
    this.appRef.tick();
  }
}
