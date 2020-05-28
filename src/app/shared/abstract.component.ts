import { OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class AbstractComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'ui-flex ui-component';
    subscriptions$: Subscription = new Subscription();

    public ngOnInit(): void {}
    public ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
    }
}