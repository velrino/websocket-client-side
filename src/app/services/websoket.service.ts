import { Injectable } from '@angular/core';
import { SocketService } from './soket.service';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService extends SocketService {
    constructor() {
        super();
    }

    sendChat(data: any) {
        this.auth().emit('start_bet', data);
    }
}