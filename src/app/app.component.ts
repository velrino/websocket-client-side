import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/websoket.service';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'websocket-client-side';
  result = 0;
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
    private webSocketService: WebSocketService,
    private requestService: RequestService
  ) {
  }

  async ngOnInit() {
    this.authUser = this.authService.getDataUser();

    if (!this.authUser) return;

    await this.getGame()

    this.webSocketService.auth().on("end_bet", (data) => {
      this.result = Number(data.gameBet.number);
      this.betResult = data;
      setTimeout(() => {
        this.betResult = data;
        this.btnDisabled = false;
      }, 1000);
    })

    // this.webSocketService.auth().on("users", (data) => {
    //   this.users = data;
    // })
  }

  start() {
    const { game } = this;
    // this.messages.push(this.message);
    const data = { number: this.message, game: game.id }
    this.webSocketService.sendChat(data);
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
