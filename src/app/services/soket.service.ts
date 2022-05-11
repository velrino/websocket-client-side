import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io } from "socket.io-client";
// import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';

import { LocalStorageKeys } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    // constructor() { }

    public socket: any;
    private SERVER_URL = 'http://localhost:3000';

    constructor() {
        console.log('START Service = socket.io-Client ');
    }

    public initSocket(): void {
        this.socket = io(environment.API);
    }

    /**
     * Снова подключится
     * @constructor
     */
    public connect(): void {
        this.socket.connect();
    }

    /**
     * Отключится
     * @constructor
     */
    public disconnect(): void {
        this.socket.disconnect();
    }

    /**
     * Отправить текст
     * @param {string} msg
     */
    public emit(event: string, data: any, isAuth = false): void {
        if (isAuth) {
            const authorization = localStorage.getItem(LocalStorageKeys.token)
            data = { ...data, authorization }
        }
        this.socket.emit(event, data);
    }

    /**
     * Получить текст
     */
    public getMessageEvent(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on("new Message", (data: any) => observer.next(data));
        });
    }

    /**
     * Повесить обработчик
     * @param {string} event
     * @returns {Observable<any | Message>}
     */
    public onEvent(event: string): Observable<any> {
        return new Observable<string>(observer => {
            this.socket.on(event, (data: any) => observer.next(data));
        });
    }

    // connect() {
    //     const Authorization = localStorage.getItem(LocalStorageKeys.token)
    //     console.log("SocketService => auth()")
    //     console.log(environment)
    //     console.log(Authorization)
    //     return io(environment.API, {
    //         autoConnect: false,
    //         transportOptions: {
    //             polling: {
    //                 extraHeaders: {
    //                     Authorization
    //                 }
    //             }
    //         }
    //     })
    // }
}