import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io } from "socket.io-client";

import { LocalStorageKeys } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor() { }

    auth() {
        const Authorization = localStorage.getItem(LocalStorageKeys.token)
        console.log("SocketService => auth()")
        console.log(environment)
        console.log(Authorization)
        return io(environment.API, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization
                    }
                }
            }
        });
        // this.ioSocket.io.opts.extraHeaders = { Authorization }
        // this.connect();
    }
}