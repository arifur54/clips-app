import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms"

export class RegisterValidators {

    static match(controlName: string, matchingControl: string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get("password");
            const matchingControl = group.get("confirm_Password");
    
            if(!control || !matchingControl){
                console.error('Form Control can not be found in the form group')
                return {controlNotFound: false }
            }
    
            const error = control.value === matchingControl.value ? null : { noMatch: true }
            matchingControl.setErrors(error);
            return error;
        }
       
    }
}

// Difference between static and non-static method

// non-Static methods must be create an instance of an object. such as new RegisterValidators.match() <~ Without static
// static methods can  be created without createing the instance of an objec.t such as RegisterValidators.match() <~ With static 
