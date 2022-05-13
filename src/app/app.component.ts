import { Component, OnInit } from '@angular/core';

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
  showResult = false;
  finalResult = false;
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

    this.webSocketService.onEvent('error').subscribe((data: any) => { console.log(data); });

    this.webSocketService.onEvent(`progress_bet_${this.game.id}`).subscribe((data: any) => this.progressBet(data));

    this.webSocketService.onEvent(`end_bet_${this.game.id}`).subscribe((data: any) => this.endBet(data));
  }

  startBet() {
    const { game } = this;
    const data = { number: this.message, game: game.id }
    this.webSocketService.emit('start_bet', data, true);
    this.btnDisabled = true;
    this.showResult = false;
    this.finalResult = false;
  }

  progressBet(data: any) {
    console.log(`progress_bet = ${data.number}`)
    this.result = data.number;
    this.btnDisabled = true;
    this.showResult = true;
    this.formatCountUp.duration = 3;
    this.finalResult = false;
  }

  endBet(data: any) {
    console.log(`end_bet = ${data.number}`)
    const result = Number(data.number);
    this.showResult = true;
    this.formatCountUp.duration = (result <= 1) ? 0 : 3;
    this.result = result;
    this.betResult = data;
    this.finalResult = true;
    this.btnDisabled = false;
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
