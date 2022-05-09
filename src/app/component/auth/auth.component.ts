import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    //   styleUrls: ['./app.component.scss']
})
export class AuthComponent implements OnInit {
    @ViewChild('auth') authModal: any;
    email = ``;
    password = ``;
    
    constructor(
        private http: HttpClient,
        private modalService: NgbModal
    ) {
    }
    ngOnInit() {

    }

    ngAfterViewInit() {
        this.modalService.open(this.authModal, { centered: true, backdrop: `static` })
        console.log("dsdsdsd")
    }

    submit() {

    }

}
