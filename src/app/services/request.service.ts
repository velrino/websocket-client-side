import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ToastService } from './toast/toast.service';
import { IToast, ToastType } from './toast/toast.dto';
import { environment } from '../../environments/environment';

export enum ResquestHTTPEnum {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

@Injectable({
    providedIn: 'root',
})
export class RequestService {

    constructor(
        public httpService: HttpClient,
        private authService: AuthService,
        public toastService: ToastService,
    ) { }

    async requestApi(
        path: string = '',
        method: ResquestHTTPEnum = ResquestHTTPEnum.GET,
        body: any = null,
        headers: any = [],
        params: any = null,
    ): Promise<any> {
        const address = `${environment.API}/api/${path}`;
        return await this.httpService.request(method, address, { body, params, headers, }).toPromise();
    }

    async requestApiWithToken(
        path: string = '',
        method: ResquestHTTPEnum = ResquestHTTPEnum.GET,
        body: any = null,
        headers: any = [],
        params: any = null,
    ): Promise<any> {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authService.getLocalToken()}`,
        }

        const address = `${environment.API}/api/${path}`;
        return await this.httpService.request(method, address, { body, params, headers }).toPromise();
    }

    async requestApiWithTokenWithoutJson(
        path: string = '',
        method: ResquestHTTPEnum = ResquestHTTPEnum.GET,
        body: any = null,
        headers: any = {},
        params: any = null,
    ): Promise<any> {
        headers = {
            'Authorization': `Bearer ${this.authService.getLocalToken()}`,
            ...headers
        }

        const address = `${environment.API}/api/${path}`;
        return await this.httpService.request(method, address, { body, params, headers }).toPromise();
    }

    handleError(text: string) {
        this.toastService.createToast(text, ToastType.danger)
    }

    toast(text: string, toast: ToastType = ToastType.success, delay: number = 7000) {
        this.toastService.createToast(text, toast, delay)
    }
}
