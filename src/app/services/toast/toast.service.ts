import { Injectable, TemplateRef } from '@angular/core';

import { IToast, ToastType } from './toast.dto';

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: IToast[] = [];

    createToast(text: string, type: ToastType = ToastType.danger, delay: number = 7000) {
        this.toasts.push({ text, type, delay })
    }

    remove(toast: any) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
}