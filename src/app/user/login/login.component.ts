import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  }

  showAlert = false;
  alertMsg = '';
  alertColor = 'blue';
  inSubmission = false; 

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login(){
    this.showAlert = true;
    this.alertMsg = 'Please Wait! Your Login attempt is being executed!';
    this.alertColor = 'blue';
    this.inSubmission = true
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
    } catch (error) {
      console.log(error);
      this.alertMsg = 'An unexpeced error occured. please try again later';
      this.alertColor = 'red'
      this.inSubmission = false;
      return
    }
    this.alertMsg = 'Login Successfull! Welcome.';
    this.alertColor = 'green';
  }


}
