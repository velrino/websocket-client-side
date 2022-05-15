import { Component, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { SocketService } from './services/soket.service';

import { EventEmitterEnum, EventEmitterService } from "./services/event-emitter.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  activeTab = 1;
  result = 0;
  startIn = 5;
  wasStarted = false;
  userIsProfited = false;
  iBet = false;
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
  currency: any;
  dataWallets: any;
  wallet: any;
  betResult: any;
  btnDisabled = false;
  public users: number = 0;
  public bets: any = [];
  public message: any = 1;
  public amount: any = 1;
  public messages: string[] = [];

  constructor(
    private authService: AuthService,
    private webSocketService: SocketService,
    private requestService: RequestService
  ) {
    EventEmitterService.get(EventEmitterEnum.Refresh_Wallet).subscribe(() => this.getWallets());
  }

  async ngOnInit() {
    this.authUser = this.authService.getDataUser();

    await this.getGame()
    await this.getWallets()

    this.webSocketService.initSocket();

    this.webSocketService.onEvent('error').subscribe((data: any) => { 
      console.log(data); 
      this.requestService.handleError(data.error)
    });

    if(this.authUser) {
      this.webSocketService.onEvent(`error_user_${this.authUser.id}`).subscribe((data: any) => { 
        this.requestService.handleError(data.error)
      });
    }


    this.webSocketService.onEvent(`players_${this.game.id}`).subscribe((data: any) => {
      this.bets = data;
      console.log(this.bets)

    });

    this.webSocketService.onEvent(`start_bet_in_${this.game.id}`).subscribe((data: any) => this.startIn = data.second);

    this.webSocketService.onEvent(`progress_bet_${this.game.id}`).subscribe((data: any) => this.progressBet(data));

    this.webSocketService.onEvent(`end_bet_${this.game.id}`).subscribe((data: any) => this.endBet(data));
  }

  startBet() {
    const { game } = this;
    const data = {
      number: this.message,
      game: game.id,
      wallet: this.wallet.id,
      amount: this.amount,
    }
    this.webSocketService.emit('start_bet', data, true);
    // this.btnDisabled = true;
    // this.showResult = false;
    // this.finalResult = false;
  }

  progressBet(data: any) {
    console.log(`progress_bet = ${data.number}`)
    this.iBet = false;
    this.wasStarted = true;
    this.result = data.number;
    this.btnDisabled = true;
    this.showResult = true;
    this.formatCountUp.duration = 3;
    this.finalResult = false;
  }

  async endBet(data: any) {
    console.log(`end_bet = ${data.number}`)
    this.startIn = 5;
    const result = Number(data.number);
    this.showResult = true;
    this.formatCountUp.duration = (result <= 1) ? 0 : 3;
    this.result = result;
    this.betResult = data;
    this.checkIsProfited()
    this.finalResult = true;
    this.btnDisabled = false;
    this.wasStarted = false;
    await this.getGame()
    await this.getWallets()
  }

  checkIsProfited() {
    if (this.betResult[`winners`] && this.authUser) {
      this.iBet = false;
      const checkIBet = this.bets.users.filter((item: any) => item.user.id === this.authUser.id)

      if (checkIBet.length) {
        this.iBet = true;
        this.userIsProfited = this.betResult.winners.includes(this.authUser.id);
      }
    }
  }

  login() {
    EventEmitterService.get(EventEmitterEnum.Auth).emit(true);
  }

  deposit() {
    EventEmitterService.get(EventEmitterEnum.Deposit).emit(this.dataWallets);
  }

  logout() {
    this.authService.logout();
    location.reload();
  }

  async getGame() {
    const gameId = `41009d8f-54b2-451c-9275-701aa6e0f1cd`;
    await this.requestService.requestApi(`game/${gameId}/last-matchs`).then((response) => this.game = response)
  }

  async getWallets() {
    await this.requestService.requestApiWithToken(`wallet/my-wallets`).then((response) => {
      this.wallet = response.favoriteWallet;
      this.dataWallets = response;
    })
  }

  hasData() {
    return this.game;
  }

  compareByID(itemOne: any, itemTwo: any) {
    return itemOne && itemTwo && itemOne.id == itemTwo.id;
  }
}
