import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { SocketService } from './services/soket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  result = 0;
  formatCountUp = {
    decimalPlaces: 2,
    duration: 3,
    separator: ".",
    decimal: ",",
  };
  authUser: any;
  game: any = null;
  betResult: any;
  btnDisabled = false;
  public users: number = 0;
  public message: any = 1;
  public messages: string[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private webSocketService: SocketService,
    private requestService: RequestService
  ) {
  }

  async ngOnInit() {
    this.authUser = this.authService.getDataUser();

    if (!this.authUser) return;

    await this.getGame()

    this.webSocketService.initSocket();

    this.webSocketService.onEvent('current_users').subscribe((data: any) => this.users=data);

    this.webSocketService.onEvent('error')
      .subscribe((data: any) => {
        console.log(data);
    });

    this.webSocketService.onEvent('end_bet')
      .subscribe((data: any) => {
        console.log(data)
        this.formatCountUp.duration = Number(data.gameBet.number) / 2;
        this.result = Number(data.gameBet.number);
        this.betResult = data;
        setTimeout(() => {
          this.betResult = data;
          this.btnDisabled = false;
        }, 1000);
    });
    // this.webSocketService.on("connect", () => {
    //   const engine = socket.io.engine;
    //   console.log(engine.transport.name); // in most cases, prints "polling"

    //   engine.once("upgrade", () => {
    //     // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    //     console.log(engine.transport.name); // in most cases, prints "websocket"
    //   });

    // });

    // this.webSocketService.auth().connect().on("current_users", (data) => {
    //   console.log(data)
    // })
  }

  start() {
    const { game } = this;
    // this.messages.push(this.message);
    const data = { number: this.message, game: game.id }
    this.webSocketService.emit('start_bet', data, true);
    this.btnDisabled = true;
  }

  logout() {
    this.authService.logout();
    location.reload();
  }

  async getGame() {
    await this.requestService.requestApi(`game`).then((response) => this.game = (response.data.length) ? response.data[0] : null)
  }

  hasData() {
    return this.authUser && this.game;
  }
}
