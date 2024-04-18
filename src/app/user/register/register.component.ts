import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { Emailtaken } from '../validators/emailtaken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(
    private auth: AuthService,
    private emailTaken : Emailtaken
  ) {
   
  }

  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);

  age = new FormControl(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ]);
  confirm_Password = new FormControl('',[
    Validators.required,
  ]);
  phoneNumber = new FormControl('',[
    Validators.required,
  ]);

  showAlert = false;
  alertMsg = '';
  alertColor = '';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_Password: this.confirm_Password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match("password", "confirm_Password")]);

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;
  
    try {
      await this.auth.createUser(this.registerForm.value as IUser)

    }catch(e) {
      console.log(e)
      this.alertMsg = 'An unexpeced error occured. please try again later';
      this.alertColor = 'red'
      this.inSubmission = false
      return 
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green' 

  }

  

}
