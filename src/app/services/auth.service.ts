import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
export enum LocalStorageKeys {
    session_type = 'session_type',
    token = 'token',
    toast = 'toast',
    expires_at = 'expires_at',
    user = 'user',
    id_token = 'id_token',
    usr_role = 'user_role',
    current_url = 'current_url',
    theme = 'theme',
    back_path = 'back_path',
    asset_type = 'asset_type',
    last_post = 'last_post',
    last_comment = 'last_comment',
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(@Inject(PLATFORM_ID) private _platformId: object,
    ) { }

    private _setSession(authResult: any): void {
        let expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + authResult.token.expiresIn);

        if (isPlatformBrowser(this._platformId)) {
            localStorage.setItem(
                LocalStorageKeys.id_token,
                authResult.token.accessToken,
            );
            localStorage.setItem(
                LocalStorageKeys.expires_at,
                expiresAt.toISOString(),
            );
            localStorage.setItem(LocalStorageKeys.usr_role, authResult.user.role);
        }
    }

    logout(message = 'Logout realizado com sucesso'): void {
        localStorage.removeItem(LocalStorageKeys.token);
        localStorage.removeItem(LocalStorageKeys.expires_at);
        localStorage.removeItem(LocalStorageKeys.usr_role);
        localStorage.removeItem(LocalStorageKeys.user);
        localStorage.setItem(LocalStorageKeys.toast, message)
        location.reload();
    }

    logoutWithoutReload(): void {
        // if (isPlatformBrowser(this._platformId)) {
        localStorage.removeItem(LocalStorageKeys.token);
        localStorage.removeItem(LocalStorageKeys.expires_at);
        localStorage.removeItem(LocalStorageKeys.usr_role);
        localStorage.removeItem(LocalStorageKeys.user);
        // }
    }

    getLocalToken() {
        return localStorage.getItem(LocalStorageKeys.token);
    }

    public isLoggedIn() {
        return new Date().getTime() < this.getExpiration().getTime();
    }

    isLoggedOut(): boolean {
        if (isPlatformBrowser(this._platformId) && this.isLoggedIn() === false) {
            localStorage.removeItem('usr_role');
        }
        return !this.isLoggedIn();
    }

    getExpiration(): Date {
        if (isPlatformBrowser(this._platformId)) {
            const expiration = localStorage.getItem(LocalStorageKeys.expires_at);
            if (expiration) {
                return new Date(expiration);
            } else {
                return new Date();
            }
        }
        return new Date();
    }

    getDataUser() {
        const localStorageItem = localStorage.getItem(LocalStorageKeys.user);
        let data = null;
        if (localStorageItem) {
            try {
                data = JSON.parse(localStorageItem);
            } catch (e) {
                return null;
            }
        }

        // EventEmitterService.get(EventEmitterEnum.UserInfo).emit(data);
        return data;
    }

    async hasIsLoggedIn() {
        const getData = this.getDataUser();
        const isLoggedIn = this.isLoggedIn();
        if (!isLoggedIn) {
            localStorage.removeItem(LocalStorageKeys.expires_at);
            return false;
        }
        if (!getData) {
            localStorage.removeItem(LocalStorageKeys.user);
            return false;
        }
        return (isLoggedIn && getData);
    }


    setAuthSession(response: any) {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + response.token.expiresIn);

        localStorage.setItem(LocalStorageKeys.token, response.token.accessToken);
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response.user));
        localStorage.setItem(LocalStorageKeys.usr_role, response.user.role);
        localStorage.setItem(
            LocalStorageKeys.expires_at,
            expiresAt.toISOString(),
        );
    }

    updateAuthSession(response: any) {
        localStorage.removeItem(LocalStorageKeys.usr_role);
        localStorage.removeItem(LocalStorageKeys.user);
        localStorage.setItem(LocalStorageKeys.user, JSON.stringify(response));
        localStorage.setItem(LocalStorageKeys.usr_role, response.role);
    }

    addDays(days = 1) {
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }
}
