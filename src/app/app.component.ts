import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/websoket.service';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'websocket-client-side';
  result = 25000000;
  authUser: any;
  public users: number = 0;
  public message: string = '';
  public messages: string[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {
  }

  ngOnInit() {
    this.authUser = this.authService.getDataUser();
    console.log(this.authUser)
    this.http.get<any>('http://localhost:3000/api/currency').subscribe(data => {
      console.log(data)
    })
    this.webSocketService.receiveChat().subscribe((message: any) => {
      this.messages.push(message);
    });
    this.webSocketService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  addChat() {
    this.messages.push(this.message);
    this.webSocketService.sendChat(this.message);
    this.message = '';
  }

  logout() {
    this.authService.logout();
    location.reload();
  }
}
