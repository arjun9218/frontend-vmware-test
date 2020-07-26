import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class MockBackend implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(urlHandler));

        function urlHandler() {
            if (url.endsWith('/users/authenticate') && method === 'POST') {
                return authenticate();
            } else if (url.endsWith('/users/register') && method === 'POST') {
                return register();
            } else if (url.endsWith('/users') && method === 'GET') {
                return getUsers();
            } else if (url.match(/\/users\/\d+$/) && method === 'DELETE') {
                return deleteUser();
            } else {
                return next.handle(request);
            }
        }

        function authenticate() {
            const { emailId, password } = body;
            const user = users.find(x => x.emailId === emailId && x.password === password);
            if (!user) {
                return throwError({ error: { message: 'Email ID or password is incorrect' }});
            }
            return ok({
                id: user.id,
                emailId: user.emailId,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'jwt-token'
            })
        }

        function register() {
            const user = body;

            if (users.find(x => x.emailId === user.emailId)) {
                return throwError({ error: { message: 'Email ID "' + user.emailId + '" already exists' }});
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x =>  x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const mockBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: MockBackend,
    multi: true
};