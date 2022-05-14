import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { RequestService, ResquestHTTPEnum } from '../../services/request.service';
import { EventEmitterEnum, EventEmitterService } from "../../services/event-emitter.service";

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
        private modalService: NgbModal,
        private requestService: RequestService,
        private authService: AuthService,
    ) {
        EventEmitterService.get(EventEmitterEnum.Auth).subscribe(() => this.openModal());
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        const authUser = this.authService.getDataUser();

        if (authUser) return;

        this.openModal()
    }

    openModal() {
        this.modalService.open(this.authModal, { centered: true })
    }

    async submit() {
        const { email, password } = this;
        await this.requestService.requestApi(
            `user/login`,
            ResquestHTTPEnum.POST,
            { email, password })
            .then((data: any) => {
                this.authService.setAuthSession(data);
                this.modalService.dismissAll();
                // this.requestService.toast(`Login feito com sucesso`)
                location.reload();
            })
            .catch((response: any) => {
                if (response[`error`][`error`]) {
                    this.requestService.handleError(response.error.error)
                }
            })
    }

}
