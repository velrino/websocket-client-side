import { Injectable } from '@angular/core';
import { SocketService } from './soket.service';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService extends SocketService {
    constructor() {
        super();
    }

    sendChat(message: any) {
        this.auth().emit('start_bet', message);
    }

    // receiveChat() {
    //     return this.fromEvent('chat');
    // }

    // getUsers() {
    //     return this.fromEvent('users');
    // }
}