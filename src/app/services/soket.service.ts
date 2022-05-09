import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io } from "socket.io-client";

import { LocalStorageKeys } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    URL = 'http://localhost:3000/';
    constructor() { }

    auth() {
        const Authorization = localStorage.getItem(LocalStorageKeys.token)
        console.log("SocketService => auth()")
        console.log(this.URL)
        console.log(Authorization)
        return io(this.URL, {
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