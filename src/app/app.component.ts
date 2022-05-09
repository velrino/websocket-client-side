import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/websoket.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'websocket-client-side';
  public users: number = 0;
  public message: string = '';
  public messages: string[] = [];

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
  }

  ngOnInit() {
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
}
