import { Component, OnInit } from '@angular/core';

import { ToastService } from './toast.service';

@Component({
    selector: 'app-shared-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    host: { '[class.ngb-toasts]': 'true' }
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }
}
