import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";


@Injectable({
    providedIn: 'root'
})
export class Emailtaken implements AsyncValidator  {
    constructor(private auth:AngularFireAuth) {
        
    }

    validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
       return this.auth.fetchSignInMethodsForEmail(control.value).then(
        response => response.length ? { emailTaken: true } : null
       )
       .catch(error => {
        console.error('Error while checking email', error);
        return { emailCheckFailed: true }
       })
    }
}
